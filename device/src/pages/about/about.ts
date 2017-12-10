import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, IonicPage, AlertController, Nav, Events } from 'ionic-angular';
import { MapsAPILoader } from '@agm/core';
import { AgeValidator } from '../../validators/age';
import { User, BusyDate } from '../../models/index';
import { AuthServiceProvider, NurseProvider, UserProvider } from '../../providers/index';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  formProfile: FormGroup;
  style = [{ "featureType": "landscape", "stylers": [{ "saturation": -100 }, { "lightness": 65 }, { "visibility": "on" }] }, { "featureType": "poi", "stylers": [{ "saturation": -100 }, { "lightness": 51 }, { "visibility": "simplified" }] }, { "featureType": "road.highway", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "road.arterial", "stylers": [{ "saturation": -100 }, { "lightness": 30 }, { "visibility": "on" }] }, { "featureType": "road.local", "stylers": [{ "saturation": -100 }, { "lightness": 40 }, { "visibility": "on" }] }, { "featureType": "transit", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "administrative.province", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": -25 }, { "saturation": -100 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "hue": "#ffff00" }, { "lightness": -25 }, { "saturation": -97 }] }];
  public latitude: number;
  public longitude: number;
  public address: string;
  public zoom: number;
  public searchControl: FormControl;
  @ViewChild("search", { read: ElementRef })
  public searchElementRef: ElementRef;
  // Reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  submitAttempt: boolean = false;
  currentUser: any;
  user: any;
  busyDates: BusyDate[] = [];
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public events: Events, private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, private alertCtrl: AlertController, private authService: AuthServiceProvider, private nurseService: NurseProvider, private userService: UserProvider) {
    this.formProfile = formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.pattern('[^@]+@[^@]+\.[a-zA-Z]{2,6}')])],
      username: ['', Validators.required],
      password: '',
      phone: [null, Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
      age: [null, AgeValidator.isValid],
      gender: ['', Validators.required],
      address: [null, Validators.required],
    });
  }

  ionViewWillEnter() {
    this.latitude = 10.772057;
    this.longitude = 106.698333;
    this.zoom = 12;
    this.searchControl = new FormControl();
    this.autoComplete();
    this.loadUserDetails();
  }

  loadUserDetails() {
    // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.authService.getCurrentUser().then((val) => {
      this.currentUser = JSON.parse(val);
      switch (this.currentUser.role) {
        case 'ROLE_User':
          this.userService.getById(this.currentUser._id).subscribe(user => {
            this.user = user;
            if (user.location) {
              this.latitude = user.location.latitude;
              this.longitude = user.location.longitude;
              this.address = user.profile.address;
            }
            console.log(this.user);
          });
          break;
        case 'ROLE_Nurse':
          this.nurseService.getById(this.currentUser._id).subscribe(nurse => {
            this.user = nurse;
            if (nurse.location) {
              this.latitude = nurse.location.latitude;
              this.longitude = nurse.location.longitude;
              this.address = nurse.profile.address;
            }
            this.busyDates = nurse.nurseprofile.busy_dates;
            console.log(this.user);
          });
          break;
      }
    });
  }

  private autoComplete() {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement.getElementsByTagName('input')[0], {
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
  save(value: any) {

    if (!this.formProfile.valid) {
      this.submitAttempt = true;
    }
    else {
      let newInfo = {
        id: this.currentUser._id,
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
      this.userService.upsert(newInfo).subscribe(result => {
        let id = result.text();
        // this.events.publish('address:changed', { id: id });
        console.log(id);
        let alert = this.alertCtrl.create({
          title: 'Register',
          subTitle: 'Register successfully!',
          buttons: ['Okay']
        });
        alert.present();
      }, err => {
        console.log(err);
      });
    }

  }
}
