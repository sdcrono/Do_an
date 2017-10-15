import { Component, OnInit, ElementRef, NgZone, ViewChild  } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { AlertService, NursesService } from '../../_services/index';
import { maxAge, minAge } from '../../_directives/index';
import { BusyDate } from '../../_interfaces/index';

@Component({
  selector: 'app-nurse-edit',
  templateUrl: './nurse-edit.component.html',
  styleUrls: ['./nurse-edit.component.css']
})
export class NurseEditComponent implements OnInit {

  nurse = {};

  requireAlert:string = 'Cần điền thông tin';
  minPassAlert:string = 'Mật khẩu phải nhiều hơn 5 ký tự';
  minPhoneAlert:string = 'Số điện thoại cần đúng 11 chữ số';
  maxPhoneAlert:string = 'Số điện thoại cần đúng 11 chữ số';
  maxAgeAlert:string = 'cần nhỏ hơn 49 tuổi';
  minAgeAlert:string = 'cần lớn hơn 21 tuổi';
  emailAlert:string = 'Cần điền đúng email';

  public latitude: number;
  public longitude: number;
  public address: string;
  public zoom: number;
  public searchControl: FormControl;
  reactiveForm: FormGroup;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  date: string;
  start: Date;
  end: Date;
  busyDates: BusyDate[] = [];
  //date variable
  limitSt: Date;
  limitEn: Date;  

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private nursesService: NursesService,
    private formBuilder: FormBuilder
  ) { 
    this.reactiveForm = formBuilder.group({
      'username': [null, Validators.required],
      'password': '',
      'name': [null, Validators.required],
      'email': [null, Validators.required],
      'phone': [null, Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
      'age': [null, Validators.compose([Validators.required, maxAge(48), minAge(22)])],
      'gender': [null, Validators.required],
      'address': [null, Validators.required],
      'certification': [null, Validators.required],
      'career': [null, Validators.required],
      'hospital': [null],
      'type': [null, Validators.required],
      'rate': [null, Validators.required],
      'retribution': [null, Validators.required],      
    })
  }

  ngOnInit() {
    this.getNurse(this.route.snapshot.params['id']);
    this.latitude = 10.772057;
    this.longitude = 106.698333;
    this.zoom = 12;
    //set Time for search
    const minHour = 7;
    const maxHour = 21;
    const minMinute = 30;
    const maxMinute = 30;
    const minSecond = 0;
    const maxSecond = 0;
    this.limitSt= new Date();            
    this.limitSt.setHours(minHour);
    this.limitSt.setMinutes(minMinute);
    this.limitSt.setSeconds(minSecond);
    this.limitEn= new Date();
    this.limitEn.setHours(maxHour);
    this.limitEn.setMinutes(maxMinute);
    this.limitEn.setSeconds(maxSecond);     
    this.searchControl = new FormControl();
    this.autoComplete();    
  }

  getNurse(id) {
    this.nursesService.getById(id).subscribe(nurse => {
      this.nurse = nurse;
      console.log("busydate:" + nurse.nurseprofile.busy_dates);
      this.busyDates = nurse.nurseprofile.busy_dates;
      console.log("Nurse ", nurse);
    });
  }

  editNurse(value: any) {
    console.log('Reactive Form Data: ')
    console.log(value);
    this.nurse = {
      id: this.route.snapshot.params['id'],
      username: value.username,
      password: value.password,
      lat: this.latitude,
      lng: this.longitude,
      name: value.name,
      email: value.email,
      phone: value.phone,
      age: value.age,
      gender: value.gender,
      address: this.address,
      certification: value.certification,
      career: value.career,
      hospital: value.hospital,
      type: value.type,
      busyDates: this.busyDates,
      rate: value.rate,
      retribution: value.retribution
    };
    this.nursesService.upsert(this.nurse).subscribe(result => {
      let id = result.text();
      console.log(id);
      this.alertService.success('Sửa thành công', true);
      this.router.navigate(['/nurses/', id]);
    }, err => {
      this.alertService.error(err);
      console.log(err);
    });
    console.log("Nurse " + this.nurse);

  }

  private autoComplete() {

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        // types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set address, latitude, longitude and zoom
          this.address = place.formatted_address;
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  } 

  addBusyDate() {
    if (this.date !== undefined && this.start !== undefined && this.end !==undefined) {
      let busyDate = {
        date: this.date,
        start_time: this.start,
        end_time: this.end
      };
      this.busyDates.push(busyDate);
      console.log(this.busyDates);
    }
    
  }

  deleteBusyDate(busyDate) {
    console.log(busyDate);
    let index = this.busyDates.indexOf(busyDate);
    console.log(index);
    if (index > -1) {
        this.busyDates.splice(index, 1);
    }
  }

}
