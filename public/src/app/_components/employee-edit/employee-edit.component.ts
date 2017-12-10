import { Component, OnInit, ElementRef, NgZone, ViewChild  } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { AlertService, EmployeesService } from '../../_services/index';
import { maxAge, minAge } from '../../_directives/index';
import { DayOff } from '../../_interfaces/index';


@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent implements OnInit {

  employee = {};
  
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
  
    date: Date;
    start: Date;
    end: Date;
    dayOff: DayOff[] = [];
    //date variable
    limitSt: Date;
    limitEn: Date;  
  
    constructor(
      private mapsAPILoader: MapsAPILoader,
      private ngZone: NgZone,
      private router: Router,
      private route: ActivatedRoute,
      private alertService: AlertService,
      private employeesService: EmployeesService,
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
        'id_number': [null, Validators.required],
        'home_town': [null, Validators.required],
        'job': [null, Validators.required],
        'education': [null, Validators.required],
        'division': [null, Validators.required],
        'salary': [null, Validators.required],
      })
    }
  
    ngOnInit() {
      this.getEmployee(this.route.snapshot.params['id']);
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
  
    getEmployee(id) {
      this.employeesService.getById(id).subscribe(employee => {
        this.employee = employee;
        console.log("busydate:" + employee.employeeprofile.day_off);
        this.dayOff = employee.employeeprofile.day_off;
        console.log("Employee ", employee);
      });
    }
  
    editEmployee(value: any) {
      console.log('Reactive Form Data: ')
      console.log(value);
      this.employee = {
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
        id_number: value.id_number,
        home_town: value.home_town,
        job: value.job,
        education: value.education,
        division: value.division,
        salary: value.salary,
        dayOff: this.dayOff,
      };
      this.employeesService.upsert(this.employee).subscribe(result => {
        let id = result.text();
        console.log(id);
        this.alertService.success('Sửa thành công', true);
        this.router.navigate(['/employees/', id]);
      }, err => {
        this.alertService.error(err, false);
        console.log(err);
      });
      console.log("Employee " + this.employee);
  
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
        let dayOff = {
          date: this.date,
          start_time: this.start,
          end_time: this.end
        };
        this.dayOff.push(dayOff);
        console.log(this.dayOff);
      }
      
    }
  
    deleteBusyDate(dayOff) {
      console.log(dayOff);
      let index = this.dayOff.indexOf(dayOff);
      console.log(index);
      if (index > -1) {
          this.dayOff.splice(index, 1);
      }
    }

}
