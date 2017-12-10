import { Component, ViewChild, ElementRef, NgZone, OnInit, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { Nurse, NurseProfile, BusyDate } from '../../models/index';
import { AuthServiceProvider, NurseProvider, UserProvider } from '../../providers/index';
import { HOUROPTION } from '../../helpers/index';

import "rxjs/add/operator/takeWhile";

import { MapsAPILoader } from '@agm/core';
import { AgmCircle } from '@agm/core/directives/circle';
import { } from '@types/googlemaps';
import { FormControl } from '@angular/forms';

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage implements OnInit {

  start = false;
  currentUser: any;
  nurses: Nurse[] = [];
  nurseProfiles: NurseProfile[] = [];
  nurseProfile: NurseProfile;
  locations: Location;


  latitude: number;
  longitude: number;
  address: string;
  district: string;
  radius: number; // meter

  style = [{ "featureType": "landscape", "stylers": [{ "saturation": -100 }, { "lightness": 65 }, { "visibility": "on" }] }, { "featureType": "poi", "stylers": [{ "saturation": -100 }, { "lightness": 51 }, { "visibility": "simplified" }] }, { "featureType": "road.highway", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "road.arterial", "stylers": [{ "saturation": -100 }, { "lightness": 30 }, { "visibility": "on" }] }, { "featureType": "road.local", "stylers": [{ "saturation": -100 }, { "lightness": 40 }, { "visibility": "on" }] }, { "featureType": "transit", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "administrative.province", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": -25 }, { "saturation": -100 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "hue": "#ffff00" }, { "lightness": -25 }, { "saturation": -97 }] }];

  searchControl: FormControl;

  // whatTime: number;
  // ahuhu: string;

  // options: NgDateRangePickerOption;

  zoom: number;
  icon: string;

  currentMarker: marker;
  patientName: string;
  patientAge: string;
  patientDesciption: string;

  money: string;
  coreMoney: number;

  value: string;

  momentVariable: any;
  limitSt: Date;
  limitEn: Date;

  monSt: number;
  monEn: number;
  tueSt: number;
  tueEn: number;
  wedSt: number;
  wedEn: number;
  thuSt: number;
  thuEn: number;
  friSt: number;
  friEn: number;
  satSt: number;
  satEn: number;
  sunSt: number;
  sunEn: number;
  subDate: Date;
  numberBusyDateAllow: number = 0;
  workingDates: BusyDate[] = [];


  searchCriteriaCareer: any;
  searchCriteriaType: any;
  searchCriteriaHospital: any;
  searchMode: any;
  hourOption: any;
  mon: any;
  tue: any;
  wed: any;
  thu: any;
  fri: any;
  sat: any;
  sun: any;
  date: string[] = ['', '', '', '', '', '', ''];

  markers: marker[] = [];

  alive: boolean = true;

  search: boolean = false;

  switch: string = "map";

  @ViewChild("search", { read: ElementRef })
  searchElementRef: ElementRef;

  @ViewChild(AgmCircle)
  public myCircle: AgmCircle;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private nursesService: NurseProvider,
    private usersService: UserProvider,
    private authService: AuthServiceProvider,
    private cdr: ChangeDetectorRef
  ) {
    this.searchCriteriaCareer = {
      id: 1,
      label: "-Chọn kinh nghiệm-",
      value: ""
    };


    this.searchCriteriaType = {
      id: 1,
      label: "-Chọn Loại hình-",
      value: ""
    };


    this.searchCriteriaHospital = {
      id: 1,
      label: "-Chọn bệnh viện-",
      value: ""
    };


    this.searchMode = {
      id: 1,
      label: "-Tìm kiếm xung quanh-",
      value: "nearby"
    };

    this.hourOption = HOUROPTION;
    this.mon = this.hourOption[0];
    this.tue = this.hourOption[0];
    this.wed = this.hourOption[0];
    this.thu = this.hourOption[0];
    this.fri = this.hourOption[0];
    this.sat = this.hourOption[0];
    this.sun = this.hourOption[0];
    // this.events.subscribe('address:changed', id => {
    //   if (id) {
    //     usersService.getById(id.id).subscribe(user => {

    //       this.ngZone.run(() => {
    //         this.latitude = user.location.latitude;
    //         this.longitude = user.location.longitude;
    //         if (this.start)
    //           this.loadAllNurseOnTheMap();
    //       })
    //     })
    //   }      
    // })
    this.events.subscribe('career:changed', career => {
      if (career !== undefined && career !== "") {
        this.searchCriteriaCareer = career;
        if (this.start)
          this.loadAllNurseOnTheMap();
      }
    })
    this.events.subscribe('type:changed', type => {
      if (type !== undefined && type !== "") {
        this.searchCriteriaType = type;
        if (this.start)
          this.loadAllNurseOnTheMap();
      }
    })
    this.events.subscribe('hospital:changed', hospital => {
      if (hospital !== undefined && hospital !== "") {
        this.searchCriteriaHospital = hospital;
        if (this.start)
          this.loadAllNurseOnTheMap();
      }
    })
    this.events.subscribe('mode:changed', mode => {
      if (mode !== undefined && mode !== "") {
        this.searchMode = mode;
        if (this.start)
          this.loadAllNurseOnTheMap();
      }
    })
    this.events.subscribe('time:changed', time => {
      if (time !== undefined && time !== "") {
        switch (time.date) {
          case 'monSt':
            this.monSt = time.value;
            break;
          case 'monEn':
            this.monEn = time.value;
            break;
          case 'tueSt':
            this.tueSt = time.value;
            break;
          case 'tueEn':
            this.tueEn = time.value;
            break;
          case 'wedSt':
            this.wedSt = time.value;
            break;
          case 'wedEn':
            this.wedEn = time.value;
            break;
          case 'thuSt':
            this.thuSt = time.value;
            break;
          case 'thuEn':
            this.thuEn = time.value;
            break;
          case 'friSt':
            this.friSt = time.value;
            break;
          case 'friEn':
            this.friEn = time.value;
            break;
          case 'satSt':
            this.satSt = time.value;
            break;
          case 'satEn':
            this.satEn = time.value;
            break;
          case 'sunSt':
            this.sunSt = time.value;
            break;
          case 'sunEn':
            this.sunEn = time.value;
            break;
        }
        if (this.start)
          this.loadAllNurseOnTheMap();
      }
    })
    this.events.subscribe('time:reset', time => {
      switch (time.date) {
        case 'monSt':
          this.monSt = time.value;
          break;
        case 'monEn':
          this.monEn = time.value;
          break;
        case 'tueSt':
          this.tueSt = time.value;
          break;
        case 'tueEn':
          this.tueEn = time.value;
          break;
        case 'wedSt':
          this.wedSt = time.value;
          break;
        case 'wedEn':
          this.wedEn = time.value;
          break;
        case 'thuSt':
          this.thuSt = time.value;
          break;
        case 'thuEn':
          this.thuEn = time.value;
          break;
        case 'friSt':
          this.friSt = time.value;
          break;
        case 'friEn':
          this.friEn = time.value;
          break;
        case 'satSt':
          this.satSt = time.value;
          break;
        case 'satEn':
          this.satEn = time.value;
          break;
        case 'sunSt':
          this.sunSt = time.value;
          break;
        case 'sunEn':
          this.sunEn = time.value;
          break;
      }
      if (this.start)
        this.loadAllNurseOnTheMap();
    })
  }

  ngOnInit() {
    this.start = true;
    this.authService.getCurrentUser().then((val) => {
      //get current user
      this.currentUser = JSON.parse(val);
      //set google maps defaults
      this.usersService.getById(this.currentUser._id).subscribe(user => {
        this.zoom = 13;
        this.latitude = user.location === undefined ? 10.778285 : user.location.latitude;
        this.longitude = user.location === undefined ? 106.697806 : user.location.longitude;
        this.radius = 5000;
        this.loadAllNurseOnTheMap();
      })

      //create search FormControl
      this.searchControl = new FormControl();

      // //load Places Autocomplete
      this.autoComplete();

      //load searched nurses

    },
      err =>
        console.log(err));

  }

  radiusChanged($event: any) {
    console.log("Changed radius!");
    // this.loadAllNurseOnTheMap();
  }

  changeSearchingRadius() {
    if (this.radius < 10000)
      this.radius += 5000;
    else {
      this.radius -= 5000;
    }
    this.loadAllNurseOnTheMap();
  }

  getCurrentLocation() {
    this.ngZone.run(() => {
      this.setCurrentPosition();
      // this.autoComplete();
      this.loadAllNurseOnTheMap();
    });
  }


  clickedMarker(marker: marker, index: number) {
    console.log("Clicked marker " + marker.name + ' at index ' + index + ' with lat ' + marker.lat + ' lng ' + marker.lng);
    // console.log(marker);
    this.currentMarker = {
      no: 2,
      name: "string",
      email: 'string',
      phone: 'string',
      sex: 'string',
      age: 'string',
      address: 'string',
      hospital: 'string',
      lat: 1,
      lng: 1,
      // label: string;
      draggable: false
    }
    this.currentMarker.no = marker.no;
    this.currentMarker.name = marker.name;
    this.currentMarker.email = marker.email;
    this.currentMarker.phone = marker.phone;
    this.currentMarker.sex = marker.sex;
    this.currentMarker.age = marker.age;
    this.currentMarker.address = marker.address;
    this.currentMarker.hospital = marker.hospital;
    this.currentMarker.lat = marker.lat;
    this.currentMarker.lng = marker.lng;
    this.currentMarker.draggable = marker.draggable;
    console.log("Clicked user " + this.nurseProfiles[this.currentMarker.no].owner.username + ' at index ' + this.currentMarker.no + ' with lat ' + marker.lat + ' lng ' + marker.lng);
    this.nurseProfile = this.nurseProfiles[this.currentMarker.no];
    switch (this.radius) {
      case 5000:
        if (this.nurseProfile.career === "LPN") {
          this.money = "400.000 VND";
          this.coreMoney = 50;
        }
        else
          if (this.nurseProfile.career === "RN" && this.nurseProfile.type === "Internal") {
            this.money = "240.000 VND";
            this.coreMoney = 30;
          }
          else if (this.nurseProfile.career === "RN" && this.nurseProfile.type === "External") {
            this.money = "160.000 VND";
            this.coreMoney = 20;
          }
        break;
      case 10000:
        if (this.nurseProfile.career === "LPN") {
          this.money = "400.000 VND";
          this.coreMoney = 50;
        }
        else
          if (this.nurseProfile.career === "RN" && this.nurseProfile.type === "Internal") {
            this.money = "320.000 VND";
            this.coreMoney = 40;
          }
          else if (this.nurseProfile.career === "RN" && this.nurseProfile.type === "External") {
            this.money = "240.000 VND";
            this.coreMoney = 30;
          }
        break;

    }
    let workingDates = {
      monSt: this.monSt,
      monEn: this.monEn,
      tueSt: this.tueSt,
      tueEn: this.tueEn,
      wedSt: this.wedSt,
      wedEn: this.wedEn,
      thuSt: this.thuSt,
      thuEn: this.thuEn,
      friSt: this.friSt,
      friEn: this.friEn,
      satSt: this.satSt,
      satEn: this.satEn,
      sunSt: this.sunSt,
      sunEn: this.sunEn,
    };
    let location = {
      latitude: this.latitude,
      longitude: this.longitude
    }
    this.navCtrl.push('NurseInformationPage', { money: this.money, nurse: this.nurseProfile, workingDates: workingDates, location: location, address: this.address, district: this.district, coreMoney: this.coreMoney });
  }

  autoComplete() {

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement.getElementsByTagName('input')[0], {
        // types: ["address"]
      });
      // this.pathsSelect = this.lockRegionForCurrentUser();
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          let address_components = place.address_components;

          address_components.forEach(address => {
            let long_name = address.long_name;
            let type = address.types.toString();
            if (type.indexOf('administrative_area_level_2') !== -1) {
              console.log("current city name: Quận:", long_name);
              this.district = long_name
            }
          })

        //set address, latitude, longitude and zoom
        this.address = place.formatted_address;
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        this.zoom = 12;
        // this.pathsSelect = this.lockRegionForCurrentUser();
        this.loadAllNurseOnTheMap();
      });
    });
  });
}

setCurrentPosition() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.zoom = 12;
    });
  }
}


deg2rad(deg) {
  return deg * (Math.PI / 180)
}

getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  // var R = 6371; // Radius of the earth in km
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = this.deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

  private checkOverlap(start1: number, start2: number, end1: number, end2: number): boolean {
  if (Math.max(start1, start2) <= Math.min(end1, end2))
    return true;
  else return false;
}

checkBusyDates(busyDates: BusyDate[]) {
  let dem = 0;
  // console.log("Busy_dates" + busyDates);
  busyDates.forEach(busyDate => {
    // console.log("Busy_dates start time" + busyDate.start_time);
    let startOldTime = new Date(busyDate.start_time);
    let startNewTime = new Date();
    startNewTime.setHours(startOldTime.getHours());
    startNewTime.setMinutes(startOldTime.getMinutes());
    startNewTime.setSeconds(0);
    // this.testSt = startNewTime;
    let endOldTime = new Date(busyDate.end_time);
    let endNewTime = new Date();
    endNewTime.setHours(endOldTime.getHours());
    endNewTime.setMinutes(endOldTime.getMinutes());
    endNewTime.setSeconds(0);
    // this.testEn = endNewTime;      
    // console.log("Burse Time " + busyDate.date + "|" + startNewTime.getHours() + "|" + startNewTime.getMinutes());
    let start = startNewTime.getHours() * 60 + startNewTime.getMinutes();
    let end = endNewTime.getHours() * 60 + endNewTime.getMinutes();
    switch (busyDate.date) {
      case "T2":
        if (this.monSt !== undefined && this.monEn !== undefined)
          if (this.checkOverlap(this.monSt, start, this.monEn, end))
            dem++;
        break;
      case "T3":
        if (this.tueSt !== undefined && this.tueEn !== undefined)
          if (this.checkOverlap(this.tueSt, start, this.tueEn, end))
            dem++;
        break;
      case "T4":
        if (this.wedSt !== undefined && this.wedEn !== undefined)
          if (this.checkOverlap(this.wedSt, start, this.wedEn, end))
            dem++;
        break;
      case "T5":
        if (this.thuSt !== undefined && this.thuEn !== undefined)
          if (this.checkOverlap(this.thuSt, start, this.thuEn, end))
            dem++;
        break;
      case "T6":
        if (this.friSt !== undefined && this.friEn !== undefined)
          if (this.checkOverlap(this.friSt, start, this.friEn, end))
            dem++;
        break;
      case "T7":
        if (this.satSt !== undefined && this.satEn !== undefined)
          if (this.checkOverlap(this.satSt, start, this.satEn, end))
            dem++;
        break;
      case "CN":
        if (this.sunSt !== undefined && this.sunEn !== undefined)
          if (this.checkOverlap(this.sunSt, start, this.sunEn, end))
            dem++;
        break;
    }
  });
  // console.log("Dem:" + dem);
  // if (dem <= this.numberBusyDateAllow) return false; else return true;
  return dem <= this.numberBusyDateAllow ? false : true;

}

loadAllNurseOnTheMap() {
  this.markers.length = 0;

  // this.markerNo = undefined;
  // this.markerName = undefined;
  // this.markerEmail = undefined;
  // this.markerPhone = undefined;
  // this.markerSex = undefined;
  // this.markerAge = undefined;
  // this.markerAddress = undefined;
  // this.markerHospital = undefined;
  // this.markerLat = undefined;
  // this.markerLng = undefined;
  this.currentMarker = undefined;


  this.nursesService.search(this.searchCriteriaCareer.value, this.searchCriteriaType.value, this.searchCriteriaHospital.value)
    .takeWhile(() => this.alive)
    .subscribe(nurses => {
      // this.nurseProfiles = nurses;
      this.nurseProfiles = [];

      let dem = 0;

      nurses.forEach(nurse => {
        // console.log("Nurse ", nurse);
        // console.log("location ", nurse.owner.location.latitude.toString());

        if (nurse.owner.username !== this.currentUser.username && nurse.owner.profile.address) {
          switch (this.searchMode.value) {
            case "nearby":
              // for old mode
              let distance = this.getDistanceFromLatLonInKm(this.latitude, this.longitude, nurse.owner.location.latitude, nurse.owner.location.longitude)
              if (distance <= this.radius) {
                let isBusy = false;
                if (nurse.busy_dates.length !== 0)
                  isBusy = this.checkBusyDates(nurse.busy_dates);
                if (!isBusy) {
                  let nurseMarker = {
                    no: dem,
                    name: nurse.owner.profile.name,
                    email: nurse.owner.profile.email,
                    phone: nurse.owner.profile.phone,
                    sex: nurse.owner.profile.sex,
                    age: nurse.owner.profile.age,
                    address: nurse.owner.profile.address,
                    hospital: nurse.hospital,
                    lat: nurse.owner.location.latitude,
                    lng: nurse.owner.location.longitude,
                    distance: distance,
                    draggable: false
                  }
                  dem++;
                  // console.log("Nurse Marker ", nurseMarker);
                  this.markers.push(nurseMarker);
                  this.nurseProfiles.push(nurse);
                }

              };
              break;
          }
        }
      });
      this.markers.sort((a, b) => a.distance - b.distance);
      dem = 0;
    });
}

ionViewDidLoad() {
  console.log('ionViewDidLoad MainPage');
}

toggleSearch() {
  if (this.search) {
    this.search = false;
  } else {
    this.search = true;
  }
  this.cdr.detectChanges();
  return this.search;
}

fastSearch() {
  if (this.markers.length > 0)
    this.clickedMarker(this.markers[0], 0)
}

}

interface marker {
  no: number;
  name?: string;
  email?: string;
  phone?: string;
  sex?: string;
  age?: string;
  address?: string;
  hospital?: string;
  lat?: number;
  lng?: number;
  distance?: number,
  draggable?: boolean;
  animation?: any;
}
