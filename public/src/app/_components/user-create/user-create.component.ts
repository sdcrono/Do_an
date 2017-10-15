import { Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { maxAge, minAge } from '../../_directives/index';
import { AlertService, UsersService } from '../../_services/index';
// import { Nurse } from '../../_models/index';
import "rxjs/add/operator/takeWhile";
import {} from '@types/googlemaps';

@Component({
  moduleId: module.id,
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {

  user: {};
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


  constructor(
    private alertService: AlertService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private usersService: UsersService,
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
    //   'address': [null, Validators.required]
    // })   
    this.reactiveForm = formBuilder.group({
      'username': [null, Validators.required],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      'name': [null, Validators.required],
      'email': [null, Validators.required],
      'phone': [null, Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
      'age': [null, Validators.compose([Validators.required, maxAge(48), minAge(22)])],
      'gender': [null, Validators.required],
      'address': [null]
    })  
  }

  ngOnInit() {
    this.latitude = 10.772057;
    this.longitude = 106.698333;
    this.zoom = 12;
    this.searchControl = new FormControl();
    this.autoComplete();    
  }

  saveUser(value: any) {
    console.log('Reactive Form Data: ')
    console.log(value);
    this.user = {
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
    };
    this.usersService.upsert(this.user).subscribe(result => {
      let id = result.text();
      // id.replace(/\"/g,'\\"');
      id = id.substring(1);
      id = id.substring(0,id.length-1);
      // console.log(id+typeof(id));
      this.alertService.success('Thêm thành công', true);
      this.router.navigate(['/users/', id]);
    }, err => {
      this.alertService.error(err);
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

}
