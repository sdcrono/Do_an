import { Component, OnInit, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { maxAge, minAge } from '../../_directives/index';
import { AlertService, EmployeesService } from '../../_services/index';
import { BusyDate } from '../../_interfaces/index';
// import { Employee } from '../../_models/index';
import "rxjs/add/operator/takeWhile";
import {} from '@types/googlemaps';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css']
})
export class EmployeeCreateComponent implements OnInit {

  employee: {};
  // requireAlert:string = 'This field is required';
  requireAlert:string = 'Cần điền thông tin';
  minPassAlert:string = 'Mật khẩu phải nhiều hơn 5 ký tự';
  minPhoneAlert:string = 'Số điện thoại cần đúng 11 chữ số';
  maxPhoneAlert:string = 'Số điện thoại cần đúng 11 chữ số';
  minIdNumberAlert:string = 'Số CMND cần từ 10 chữ số';
  maxIdNumberAlert:string = 'Số CMND cần nhở hơn 13 chữ số';
  maxAgeAlert:string = 'cần nhỏ hơn 49 tuổi';
  minAgeAlert:string = 'cần lớn hơn 21 tuổi';
  emailAlert:string = 'Cần điền đúng email';

  // username: string;
  // password: string;
  // firstname: string;
  // lastname: string;
  // email: string;
  // phone: number;
  // age: number;
  // gender: string;
  // address: string;
  // id_number: string;
  // home_town: string;
  // salary: string;
  // type: string;
  public latitude: number;
  public longitude: number;
  public address: string;
  public zoom: number;
  public searchControl: FormControl;
  reactiveForm: FormGroup;
  private alive: boolean = true;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  date: string;
  start: Date;
  end: Date;
  busyDates: BusyDate[] = [];
  //date variable
  momentVariable: any;
  limitSt: Date;
  limitEn: Date;  

  constructor(
    private alertService: AlertService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private employeesService: EmployeesService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { 
    // this.reactiveForm = formBuilder.group({
    //   'username': [null, Validators.required],
    //   'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
    //   'name': [null, Validators.required],
    //   'email': [null, Validators.required],
    //   'phone': [null, Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
    //   'age': [null, Validators.compose([Validators.required, maxAge(48), minAge(22)])],
    //   'gender': [null, Validators.required],
    //   'address': [null, Validators.required],
    //   'id_number': [null, Validators.required],
    //   'home_town': [null, Validators.required],
    //   'salary': [null, Validators.required],
    //   'type': [null, Validators.required],
    // })
     this.reactiveForm = formBuilder.group({
      'username': [null, Validators.required],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      'name': [null, Validators.required],
      'email': [null, Validators.required],
      'phone': [null, Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
      'age': [null, Validators.compose([Validators.required, maxAge(48), minAge(22)])],
      'gender': [null, Validators.required],
      'address': [null, Validators.required],
      'id_number': [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(12)])],
      'home_town': [null, Validators.required],
      'job': [null, Validators.required],
      'education': [null, Validators.required],
      'division': [null, Validators.required],
      'salary': [null, Validators.required],
    })   
  }

  ngOnInit() {
    this.latitude = 10.772057;
    this.longitude = 106.698333;
    this.zoom = 12;
    //set Time for search
    // const minHour = 7;
    // const maxHour = 21;
    // const minMinute = 30;
    // const maxMinute = 30;
    // const minSecond = 0;
    // const maxSecond = 0;
    // this.limitSt= new Date();            
    // this.limitSt.setHours(minHour);
    // this.limitSt.setMinutes(minMinute);
    // this.limitSt.setSeconds(minSecond);
    // this.limitEn= new Date();
    // this.limitEn.setHours(maxHour);
    // this.limitEn.setMinutes(maxMinute);
    // this.limitEn.setSeconds(maxSecond);    
    this.searchControl = new FormControl();
    this.autoComplete();
  }

  ngOnDestroy() {
    this.alive = false;
  }
  
  saveEmployee(value: any) {
    console.log('Reactive Form Data: ')
    console.log(value);
    this.employee = {
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
      id_number: value.id_number,
      home_town: value.home_town,
      job: value.job,
      education: value.education,
      division: value.division,
      salary: value.salary,
    };
    this.employeesService.upsert(this.employee).takeWhile(() => this.alive).subscribe(result => {
      let id = result.text();
      id = id.substring(1);
      id = id.substring(0,id.length-1);
      console.log(id);
      this.alertService.success('Thêm thành công', true);
      this.router.navigate(['/employees/', id]);
    }, err => {
      this.alertService.error(err, false);
      console.log(err);
    });
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

  // addBusyDate() {
  //   if (this.date !== undefined && this.start !== undefined && this.end !==undefined) {
  //     let busyDate = {
  //       date: this.date,
  //       start_time: this.start,
  //       end_time: this.end
  //     };
  //     this.busyDates.push(busyDate);
  //     console.log(this.busyDates);
  //   }

  // }

  // deleteBusyDate(busyDate) {
  //   console.log(busyDate);
  //   let index = this.busyDates.indexOf(busyDate);
  //   console.log(index);
  //   if (index > -1) {
  //     this.busyDates.splice(index, 1);
  //   }
  // }

}
