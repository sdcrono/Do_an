import { Component, Directive, ElementRef, NgZone, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from "@angular/platform-browser";
import { Router } from '@angular/router';
import { AgmCoreModule, MapsAPILoader, AgmPolygon, LatLngLiteral, LatLngBounds } from '@agm/core';
import { NgDateRangePickerOptions } from 'ng-daterangepicker';
// import { DateRangePickerModule } from 'ng-pick-daterange';
import * as moment from 'moment';
import { AgmCircle } from '@agm/core/directives/circle';
// import { AgmPolygon } from '@agm/core/directives/polygon';
import { User, Location, ContractModel, ContractDetailModel, BusyDate } from '../_models/index';
import { Nurse, NurseProfile, Contract, Users } from '../_interfaces/index';
import { AlertService, NursesService, MarkersService, ContractsService } from '../_services/index';
import {Observable} from 'rxjs/Observable';
import "rxjs/add/operator/takeWhile";
import {} from '@types/googlemaps';

@Component({
  moduleId: module.id,  
  // selector: 'app-nurse-provide',
  templateUrl: './nurse-provide.component.html',
  styleUrls: ['./nurse-provide.component.css'],
  providers: [MarkersService]
})
export class NurseProvideComponent implements OnInit, OnDestroy, AfterViewInit {

  //nurses: NurseProfile[] = [];
  currentUser: User;
  nurses: Nurse[] = [];
  nurseProfiles: NurseProfile[] = [];
  nurseProfile: NurseProfile;
  public locations: Location;
  // latlngBounds;

  //Start Position for marker and circle
  public latitude: number;
  public longitude: number;
  public address: string;
  public radius: number; //meter
  // yourLatLng;

  //style of google map
  public styles = [{"featureType": "landscape", "stylers": [{"saturation": -100}, {"lightness": 65}, {"visibility": "on"}]}, {"featureType": "poi", "stylers": [{"saturation": -100}, {"lightness": 51}, {"visibility": "simplified"}]}, {"featureType": "road.highway", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "road.arterial", "stylers": [{"saturation": -100}, {"lightness": 30}, {"visibility": "on"}]}, {"featureType": "road.local", "stylers": [{"saturation": -100}, {"lightness": 40}, {"visibility": "on"}]}, {"featureType": "transit", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "administrative.province", "stylers": [{"visibility": "off"}]}, {"featureType": "water", "elementType": "labels", "stylers": [{"visibility": "on"}, {"lightness": -25}, {"saturation": -100}]}, {"featureType": "water", "elementType": "geometry", "stylers": [{"hue": "#ffff00"}, {"lightness": -25}, {"saturation": -97}]}];


  //Search form
  public searchControl: FormControl;

  //Time
  whatTime: number;
  ahuhu: string;

  //daterangepicker option
  options: NgDateRangePickerOptions;

  //Zoom level
  public zoom: number;
  public icon : string;

  //values
  markerNo: number;
  markerName: string;
  markerEmail: string;
  markerPhone: number;   
  markerSex: string;
  markerAge: string;
  markerAddress: string;
  markerHospital: string;
  markerLat: number;
  markerLng: number;
  markerDraggable: boolean;
  patientName: string;
  patientAge: string;
  patientDescription: string;

  //payment
  money: string;

  //dateRangePickerValue
  value: string;

  //date variable
  momentVariable: any;
  limitSt: Date;
  limitEn: Date;
  // testSt: Date;
  // testEn: Date;
  monSt: Date;
  monEn: Date;
  tueSt: Date;
  tueEn: Date;
  wedSt: Date;
  wedEn: Date;
  thuSt: Date;
  thuEn: Date;
  friSt: Date;
  friEn: Date;    
  satSt: Date;
  satEn: Date;  
  sunSt: Date;
  sunEn: Date;
  subDate: Date;
  numberBusyDateAllow: number = 0;
  workingDates: BusyDate[] = [];

  //search options and values
  private selectCareerOption: any;
  private selectTypeOption: any;
  private selectHospitalOption: any;
  private selectMode: any;
  private searchCriteriaCareer: any;
  private searchCriteriaType: any;
  private searchCriteriaHospital: any;
  private searchMode: any;
  private hourOption: any;
  private mon: any;
  private tue: any;
  private wed: any;
  private thu: any;
  private fri: any;
  private sat: any;
  private sun: any;
  private date: string[] = ['','','','','','',''];

  //Markers
  markers: marker[] = [
    // {
    //   name: 'Nurse1',
    //   lat: 10.793581,
    //   lng:  106.678031,
    //   draggable: true
    // },
    // {
    //   name: 'Nurse2',
    //   lat: 10.845614,
    //   lng: 106.777996,
    //   draggable: true
    // },
    // {
    //   name: 'Nurse3',
    //   lat: 10.783160,
    //   lng: 106.664787,
    //   draggable: true
    // },
  ];

  pathsSelect: string;
  paths: Array<LatLngLiteral> = [
      { lat: 10.770000,  lng: 106.670000 },
      { lat: 10.770000,  lng: 106.710000 },
      { lat: 10.800000,  lng: 106.710000 },
      { lat: 10.800000,  lng: 106.670000 }
    ];
  pathsCenter: Array<LatLngLiteral> = [
      { lat: 10.770000,  lng: 106.670000 },
      { lat: 10.770000,  lng: 106.710000 },
      { lat: 10.800000,  lng: 106.710000 },
      { lat: 10.800000,  lng: 106.670000 }
    ];

  pathsTop: Array<LatLngLiteral> = [
      { lat: 10.800000,  lng: 106.670000 },
      { lat: 10.800000,  lng: 106.710000 },
      { lat: 10.830000,  lng: 106.710000 },
      { lat: 10.830000,  lng: 106.670000 }
    ];
    
  pathsBottom: Array<LatLngLiteral> = [
      { lat: 10.740000,  lng: 106.670000 },
      { lat: 10.740000,  lng: 106.710000 },
      { lat: 10.770000,  lng: 106.710000 },
      { lat: 10.770000,  lng: 106.670000 }
    ];

  pathsLeft: Array<LatLngLiteral> = [
      { lat: 10.770000,  lng: 106.630000 },
      { lat: 10.770000,  lng: 106.670000 },
      { lat: 10.800000,  lng: 106.670000 },
      { lat: 10.800000,  lng: 106.630000 }
    ];    

  pathsRight: Array<LatLngLiteral> = [
      { lat: 10.770000,  lng: 106.710000 },
      { lat: 10.770000,  lng: 106.750000 },
      { lat: 10.800000,  lng: 106.750000 },
      { lat: 10.800000,  lng: 106.710000 }
    ];   
  //the attribute nhận nhiệm vụ subcribe/unsubcribe
  private alive: boolean = true;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  @ViewChild(AgmCircle)
  public myCircle: AgmCircle;

  @ViewChild(AgmPolygon)
  public myPolygon: google.maps.Polygon;  

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private http: HttpModule,
    private router: Router,
    private alertService: AlertService,
    private nursesService: NursesService,
    private markerService: MarkersService,
    private contractsService: ContractsService
  ) { 
    this.selectCareerOption = [
      {
        id: 1,
        label: "-Chọn kinh nghiệm-",
        value: ""
      }, {
        id: 2,
        label: "Trên 5 năm kinh nghiệm",
        value: "LPN"
      }, {
        id: 3,
        label: "Dưới 5 năm kinh nghiệm",
        value: "RN"
      }
    ];

    this.searchCriteriaCareer = this.selectCareerOption[0];

    this.selectTypeOption = [
      {
        id: 1,
        label: "-Chọn Loại hình-",
        value: ""
      }, {
        id: 2,
        label: "Điều dưỡng chính quy",
        value: "Internal"
      }, {
        id: 3,
        label: "Điều dưỡng gia đình",
        value: "External"
      }
    ];

    this.searchCriteriaType = this.selectTypeOption[0];

    this.selectHospitalOption = [
      {
        id: 1,
        label: "-Chọn bệnh viện-",
        value: ""
      }, {
        id: 2,
        label: "BỆNH VIỆN AN BÌNH",
        value: "BỆNH VIỆN AN BÌNH"
      }, {
        id: 3,
        label: "BỆNH VIỆN QUÂN DÂN MIỀN ĐÔNG",
        value: "BỆNH VIỆN QUÂN DÂN MIỀN ĐÔNG"
      }, {
        id: 4,
        label: "BỆNH VIỆN PHỤ SẢN TỪ DŨ",
        value: "BỆNH VIỆN PHỤ SẢN TỪ DŨ"
      }, {
        id: 5,
        label: "BỆNH VIỆN UNG BƯỚU TP.HCM",
        value: "BỆNH VIỆN UNG BƯỚU TP.HCM"
      }, {
        id: 6,
        label: "BỆNH VIỆN TRUYỀN MÁU HUYẾT HỌC",
        value: "BỆNH VIỆN TRUYỀN MÁU HUYẾT HỌC"
      }, {
        id: 7,
        label: "BỆNH VIỆN Y HỌC CỔ TRUYỀN",
        value: "BỆNH VIỆN Y HỌC CỔ TRUYỀN"
      }, {
        id: 7,
        label: "BỆNH VIỆN BÌNH DÂN",
        value: "BỆNH VIỆN BÌNH DÂN"
      }, {
        id: 8,
        label: "BỆNH VIỆN BỆNH NHIỆT ĐỚI",
        value: "BỆNH VIỆN BỆNH NHIỆT ĐỚI"
      }, {
        id: 9,
        label: "BỆNH VIỆN MẮT TP.HCM",
        value: "BỆNH VIỆN MẮT TP.HCM"
      }, {
        id: 10,
        label: "BỆNH VIỆN TAI MŨI HỌNG TP.HCM",
        value: "BỆNH VIỆN TAI MŨI HỌNG TP.HCM"
      }, {
        id: 11,
        label: "BỆNH VIỆN NHÂN DÂN 115",
        value: "BỆNH VIỆN NHÂN DÂN 115"
      }, {
        id: 12,
        label: "BỆNH VIỆN TRƯỜNG ĐH Y DƯỢC",
        value: "BỆNH VIỆN TRƯỜNG ĐH Y DƯỢC"
      }, {
        id: 13,
        label: "BỆNH VIỆN CHỢ RẪY",
        value: "BỆNH VIỆN CHỢ RẪY"
      }, {
        id: 13,
        label: "BỆNH VIỆN NGUYỄN TRI PHƯƠNG",
        value: "BỆNH VIỆN NGUYỄN TRI PHƯƠNG"
      }, {
        id: 14,
        label: "BỆNH VIỆN NHÂN DÂN GIA ĐỊNH",
        value: "BỆNH VIỆN NHÂN DÂN GIA ĐỊNH"
      }, {
        id: 15,
        label: "BỆNH VIỆN PHẠM NGỌC THẠCH",
        value: "BỆNH VIỆN PHẠM NGỌC THẠCH"
      }, {
        id: 16,
        label: "QUÂN Y VIỆN 175",
        value: "QUÂN Y VIỆN 175"
      }, {
        id: 17,
        label: "BỆNH VIỆN BƯU ĐIỆN 2",
        value: "BỆNH VIỆN BƯU ĐIỆN 2"
      }
    ];
    
    this.searchCriteriaHospital = this.selectHospitalOption[0];

    this.selectMode = [
      {
        id: 1,
        label: "-Tìm kiếm xung quanh-",
        value: "nearby"
      }, {
        id: 2,
        label: "-Tìm kiếm theo khu vực-",
        value: "sector"
      }
    ];

    this.searchMode = this.selectMode[0];

    this.hourOption = [
      {
        id: 1,
        label: "-None-",
        value: ""
      }, {
        id: 2,
        label: "sáng: 7h30-10h30",
        value: "sáng: 7h30-10h30"
      }, {
        id: 3,
        label: "chiều: 1h30-4h30",
        value: "chiều: 1h30-4h30"
      }, {
        id: 4,
        label: "tối: 6h-9h",
        value: "tối: 6h-9h"
      }, {
        id: 5,
        label: "cả ngày: 7h30-4h30 (2 ca)",
        value: "cả ngày: 7h30-4h30 (2 ca)"
      }
    ];
    this.mon = this.hourOption[0];
    this.tue = this.hourOption[0];
    this.wed = this.hourOption[0];
    this.thu = this.hourOption[0];
    this.fri = this.hourOption[0];
    this.sat = this.hourOption[0];
    this.sun = this.hourOption[0];
  }

  ngOnInit() {

    //get current user
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //set google maps defaults
    console.log("C "+ this.currentUser.lat);
    this.zoom = 13;
    this.latitude = this.currentUser.lat === undefined ? 10.778285 : this.currentUser.lat;
    this.longitude = this.currentUser.lng === undefined ? 106.697806 : this.currentUser.lng;
    this.radius = 5000;
    // this.yourLatLng = new google.maps.LatLng(this.latitude, this.longitude);

    //create search FormControl
    this.searchControl = new FormControl();

    //Payment init
    this.money = "50.000 VND";

    // this.whatTime = Observable.interval(1000).map(x => new Date()).share();
    // this.whatTime = Date.now();
    this.ahuhu = "Date.now()";
    console.log("Now:" + this.whatTime);

    //set Time for search
    const minHour = 7;
    const maxHour = 21;
    const minMinute = 30;
    const maxMinute = 31;
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

    //default option for daterangepicker
    this.options = {
      theme: 'gray',
      range: 'tm',
      dayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      presetNames: ['This Month', 'Last Month', 'This Week', 'Last Week', 'This Year', 'Last Year', 'Start', 'End'],
      dateFormat: 'yMd',
      outputFormat: 'DD/MM/YYYY',
      startOfWeek: 0
    };

    //set current position
    // this.setCurrentPosition();

    //load searched nurses
    // this.loadAllNurseOnTheMap();

    // //fillbound nurse locations to the map
    // this.fillboundAllNurseOnTheMap();

    //load Places Autocomplete
    this.autoComplete();

        //load searched nurses
    this.loadAllNurseOnTheMap();

  }

  clickedMarker(marker: marker, index: number) {
    console.log("Clicked marker " + marker.name + ' at index ' + index + ' with lat ' + marker.lat + ' lng ' + marker.lng);
    this.markerNo = marker.no;
    this.markerName = marker.name;
    this.markerEmail= marker.email;
    this.markerPhone= marker.phone;   
    this.markerSex= marker.sex;
    this.markerAge= marker.age;
    this.markerAddress= marker.address;
    this.markerHospital= marker.hospital;    
    this.markerLat= marker.lat;
    this.markerLng = marker.lng;
    this.markerDraggable = marker.draggable;
    console.log("Clicked user " + this.nurseProfiles[this.markerNo].owner.username + ' at index ' + this.markerNo + ' with lat ' + marker.lat + ' lng ' + marker.lng);
    this.nurseProfile = this.nurseProfiles[this.markerNo];
    switch(this.radius) {
      case 5000:
        if (this.nurseProfile.career === "LPN")
          this.money = "400.000 VND";
        else
          if (this.nurseProfile.career === "RN" && this.nurseProfile.type === "Internal")
            this.money = "200.000 VND";
          else if (this.nurseProfile.career === "RN" && this.nurseProfile.type === "External")
            this.money = "100.000 VND";
        break;    
      case 10000:
        if (this.nurseProfile.career === "LPN")
          this.money = "400.000 VND";
        else
          if (this.nurseProfile.career === "RN" && this.nurseProfile.type === "Internal")
            this.money = "300.000 VND";
          else if (this.nurseProfile.career === "RN" && this.nurseProfile.type === "External")
            this.money = "200.000 VND";
        break;          
      
    }
  }

  click($event: any){
    console.log(`click event is called {$event}`);
    // console.log('click event is called {$event}' +  $event.coords.lat + '-' + $event.coords.lng);
  }
  
  delete($event: any){
    console.log(`delete is called {$event}`);
  }

  mapClicked($event: any) {
    console.log("Clicked map");
    // let newMarker = {
    //   no: -1,
    //   name: 'Untitle',
    //   lat: $event.coords.lat,
    //   lng: $event.coords.lng,
    //   draggable: false
    // }
    // this.markers.push(newMarker);
  }

  markerDragEnd(marker: any, $event: any) {
    console.log("dragEnd ", marker, $event);

    var updMarker = {
      name: marker.name,
      lat: parseFloat(marker.lat),
      lng: parseFloat(marker.lng),
      draggable: false
    }

    var newLat = $event.coords.lat;
    var newLng = $event.coords.lng;

  }

  radiusChanged($event: any) {
    console.log("Changed radius!");
    this.loadAllNurseOnTheMap();
  }

  expandSearchingRadius() {
    if (this.radius<10000)
      this.radius += 5000;
    
    this.loadAllNurseOnTheMap();
  }

  collapseSearchingRadius() {
    if (this.radius>5000)
      this.radius -= 5000;
    this.loadAllNurseOnTheMap();
  }

  onChangeCareer($event: any) {
    this.loadAllNurseOnTheMap();
  }

  onChangeType($event: any) {
    this.loadAllNurseOnTheMap();
  }

  onChangeHospital($event: any) {
    this.loadAllNurseOnTheMap();
  }

  onChangeMode($event: any) {
    this.loadAllNurseOnTheMap();
  }  

  onChangeHour($event: any, date: string) {
    switch(date) {
      case 'mon': 
        this.date[0] = "Thứ 2 - " +this.mon.value;
        break;
      case 'tue': 
        this.date[1] = "Thứ 3 - " +this.tue.value;
        break;
      case 'wed': 
        this.date[2] = "Thứ 4 - " +this.wed.value;
        break;
      case 'thu': 
        this.date[3] = "Thứ 5 - " +this.thu.value;
        break;
      case 'fri': 
        this.date[4] = "Thứ 6 - " +this.fri.value;
        break;
      case 'sat': 
        this.date[5] = "Thứ 7 - " +this.sat.value;
        break;
      case 'sun': 
        this.date[6] = "Chủ Nhật - " +this.sun.value;
        break;                                          
    }
      console.log(this.date);
  }

  setMoment(moment: any): any {
    this.momentVariable = moment;
    console.log("time:"+this.momentVariable);
  }

  setMonSt($event) {
    // console.log($event);
    this.loadAllNurseOnTheMap();
  }

  setMonEn($event) {
    // if (this.monEn.getTime() < this.monSt.getTime())
    //   console.log("Cái gì ko đúng");
    this.loadAllNurseOnTheMap();
  }
  
  setTueSt($event) {
    // console.log($event);
    this.loadAllNurseOnTheMap();
  }

  setTueEn($event) {
    this.loadAllNurseOnTheMap();
  }    

  setWedSt($event) {
    // console.log($event);
    this.loadAllNurseOnTheMap();
  }

  setWedEn($event) {
    this.loadAllNurseOnTheMap();
  }
  
  setThuSt($event) {
    // console.log($event);
    this.loadAllNurseOnTheMap();
  }

  setThuEn($event) {
    this.loadAllNurseOnTheMap();
  }
  
  setFriSt($event) {
    // console.log($event);
    this.loadAllNurseOnTheMap();
  }

  setFriEn($event) {
    this.loadAllNurseOnTheMap();
  }    

  setSatSt($event) {
    // console.log($event);
    this.loadAllNurseOnTheMap();
  }

  setSatEn($event) {
    this.loadAllNurseOnTheMap();
  }
  
  setSunSt($event) {
    // console.log($event);
    this.loadAllNurseOnTheMap();
  }

  setSunEn($event) {
    this.loadAllNurseOnTheMap();
  }

  resetTime(thu: string) {
    switch (thu) {
      case "T2":
        this.monSt = undefined;
        this.monEn = undefined;
        break;       
      case "T3":
        this.tueSt = undefined;
        this.tueEn = undefined;
        break;   
      case "T4":
        this.wedSt = undefined;
        this.wedEn = undefined;
        break;   
      case "T5":
        this.thuSt = undefined;
        this.thuEn = undefined;
        break;   
      case "T6":
        this.friSt = undefined;
        this.friEn = undefined;
        break;   
      case "T7":
        this.satSt = undefined;
        this.satEn = undefined;
        break;   
      case "CN":
        this.sunSt = undefined;
        this.sunEn = undefined;
        break;   
    }

    this.loadAllNurseOnTheMap();
  }
  
  check() {
    console.log("a"+this.subDate);
    this.subDate = new Date();
    console.log("b"+this.subDate);
    // this.subDate.setDate(Date.now());
    // console.log("c"+this.subDate);
    this.monSt.setSeconds(0);
    this.monEn.setSeconds(0);
    this.tueSt.setSeconds(0);
    this.tueEn.setSeconds(0);    
    if (Math.max(this.monSt.getTime(), this.tueSt.getTime()) <= Math.min(this.monEn.getTime(), this.tueEn.getTime()))
      console.log("true");
    else
      console.log("false");
    // this.subDate.setDate(this.monEn.getTime() - this.monSt.getTime());
    // console.log("D"+this.subDate);
    console.log();
  }  

  chooseMarker() {
    // event.preventDefault();
    console.log("Choosing nurse is " + this.nurses[this.markerNo].username + ' at index ' + this.markerNo);
    // let choosingNurse= {
    //   userId: this.currentUser._id,
    //   nurseId: this.nurses[this.markerNo].id,
    //   created_at: "2017-12-11",
    //   end_at: "2017-12-12"
    // }
    // console.log("ahuhu" + this.value);
    // this.contractsService.create(contract).subscribe(
    //             data => {
    //                 this.alertService.success('Make a contract successful', true);
    //                 this.ahuhu ="123";
    //                 // this.router.navigate(['/login']);
    //             },
    //             error => {
    //                 this.alertService.error(error);
    //                 this.ahuhu ="456";
    //                 // this.loading = false;
    //             });
  }

  checkEmptySchedule() {
    let countSchedule = 0;
    if (this.monSt == undefined || this.monEn == undefined)
      countSchedule++;
    if (this.tueSt == undefined || this.tueEn == undefined)
      countSchedule++;
    if (this.wedSt == undefined || this.wedEn == undefined)
      countSchedule++;
    if (this.thuSt == undefined || this.thuEn == undefined)
      countSchedule++;
    if (this.friSt == undefined || this.friEn == undefined)
      countSchedule++;
    if (this.satSt == undefined || this.satEn == undefined)
      countSchedule++;                   
    if (this.sunSt == undefined || this.sunEn == undefined)
      countSchedule++;
    if (countSchedule == 7)
      return true;
    else return false     
  }

  convertDate(d)
  {
    var parts = d.split('/',3);
    return new Date(parts[2], parts[1]-1, parts[0]);
  }


  makeContract() {
    console.log(this.value)
    console.log("Choosing nurse is " + this.nurseProfile.owner.username + ' at index ' + this.markerNo);
    console.log("Choosing nurse is " + this.patientName + ' at index ' + this.patientAge);
    if (this.value === undefined) {
      this.alertService.error('Cần chọn khoảng thời gian làm việc!');
      return;
    }
    else if (this.patientName === "" || this.patientName === undefined ) {
      this.alertService.error('Cần điền tên người bệnh!');
      return;
    }
    else if (+this.patientAge <= 8 || +this.patientAge >= 70 || this.patientAge === undefined) {
      this.alertService.error('Cần điền tuổi người bệnh (Từ 8 đến 70 tuổi)!');
      return;
    }
    else {
      let day = this.value.split("-",2);
      let date = new Date(Date.now());
      let startDate = this.convertDate(day[0]);
      let endDate = this.convertDate(day[1]);
      if (this.checkEmptySchedule()) {
        this.alertService.error('Cần chọn lịch làm việc!');
        return;
      }
      else if(startDate <= date) {
        console.log("<=" + startDate + "," + endDate + "," + date);
        this.alertService.success('Ngày bắt đầu trước hôm nay!', false);
        return;
      }

      else {
        startDate.setDate(startDate.getDate());
        endDate.setDate(endDate.getDate());
        let loc = new Location(this.latitude, this.longitude);
        console.log(">" + startDate + "," + endDate + "," + date + "," + this.nurseProfile.owner._id);
        this.addBusyDates();
        let contractDetail = new ContractDetailModel(this.patientDescription,this.workingDates);
        let contract = new ContractModel(this.currentUser._id, this.nurseProfile.owner._id, startDate, endDate, this.patientName, this.patientAge, this.address, loc, this.money, contractDetail);
        this.contractsService.create(contract).takeWhile(() => this.alive).subscribe(
          data => {
              this.alertService.success('Make a contract successful', true);
              this.ahuhu ="123";
              let id = data.text();
              id = id.substring(1);
              id = id.substring(0,id.length-1);              
              console.log(id);
              this.router.navigate(['/contracts/', id]);
          },
          error => {
              this.alertService.error(error);
              this.ahuhu ="456";
              // this.loading = false;
          });
      }


    }

  }

  addBusyDates() {
    if (this.monSt !== undefined && this.monEn !==undefined) {
      let workingDate = new BusyDate("T2", this.monSt, this.monEn);
      this.workingDates.push(workingDate);
    }

    if (this.tueSt !== undefined && this.tueEn !==undefined) {
      let workingDate = new BusyDate("T3", this.tueSt, this.tueEn);
      this.workingDates.push(workingDate);     
    }

    if (this.wedSt !== undefined && this.wedEn !==undefined) {
      let workingDate = new BusyDate("T4", this.wedSt, this.wedEn);
      this.workingDates.push(workingDate);     
    }

    if (this.thuSt !== undefined && this.thuEn !==undefined) {
      let workingDate = new BusyDate("T5", this.thuSt, this.thuEn);
      this.workingDates.push(workingDate);      
    }

    if (this.friSt !== undefined && this.friEn !==undefined) {
      let workingDate = new BusyDate("T6", this.friSt, this.friEn);
      this.workingDates.push(workingDate);       
    }

    if (this.satSt !== undefined && this.satEn !==undefined) {
      let workingDate = new BusyDate("T7", this.satSt, this.satEn);
      this.workingDates.push(workingDate);      
    }

    if (this.sunSt !== undefined && this.sunEn !==undefined) {
      let workingDate = new BusyDate("CN", this.sunSt, this.sunEn);
      this.workingDates.push(workingDate);     
    }
 
  }

  // private fillboundAllNurseOnTheMap() {

  //   this.mapsAPILoader.load().then(() => {
  //       this.latlngBounds = new window['google'].maps.latlngBounds();
  //       this.markers.forEach(marker => 
  //       this.latlngBounds.extend(new window['google'].maps.LatLng(marker.lat, marker.lng))
  //     );
  //   })
  // }

  private autoComplete() {

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        // types: ["address"]
      });
      this.pathsSelect = this.lockRegionForCurrentUser();
      let nurseLatLng = new google.maps.LatLng(10, 30);
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
          this.pathsSelect = this.lockRegionForCurrentUser();
          this.loadAllNurseOnTheMap();
        });
      });
    });
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  private getCurrentLocation() {
    this.ngZone.run(() => {
      this.setCurrentPosition();
      // this.autoComplete();
      this.loadAllNurseOnTheMap();
    });
  }

  // var rad = function(x) {
  //   return x * Math.PI / 180;
  // };

  // var getDistance = function(p1, p2) {
  //   var R = 6378137; // Earth’s mean radius in meter
  //   var dLat = rad(p2.lat() - p1.lat());
  //   var dLong = rad(p2.lng() - p1.lng());
  //   var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
  //     Math.sin(dLong / 2) * Math.sin(dLong / 2);
  //   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   var d = R * c;
  //   return d; // returns the distance in meter
  // };

  public deg2rad(deg) {
      return deg * (Math.PI/180)
   }

  public getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    // var R = 6371; // Radius of the earth in km
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
   }



  // private loadAllNurseOnTheMap() {
  //   let dem = 0;
  // //   var bounds = this.myCircle.getBounds().then((m) => {
  // //   console.log('native map',m);
  // // }, err=>{
  // //   console.log('error',err);
  // // })
  //     this.markers.length = 0;
  //     this.nursesService.search(this.searchCriteriaCareer.value, this.searchCriteriaType.value, this.searchCriteriaHospital.value).subscribe(nurses => { 
  //       // this.nurses = nurses;
  //       // this.nurses.forEach(nurse => {
  //       //   console.log("Nurse ", nurse);
  //       //   console.log("location ", this.locations);
  //       //   // let nurseMarker = {
  //       //   //   name: nurse.username,
  //       //   //   lat: +nurse.location.latitude.toString(),
  //       //   //   lng: +nurse.location.longitude.toString(),
  //       //   //   draggable: false
  //       //   // }
  //       //   var locationss = new Location();
  //       //   locationss= Object.assign({}, nurse.location);
  //       //   let nurseMarker = {
  //       //     name: nurse.username,
  //       //     lat: locationss.latitude,
  //       //     lng: locationss.longitude,
  //       //     draggable: false
  //       //   }

  //         this.nurses = nurses;
  //         nurses.forEach(nurse => {
  //         console.log("Nurse ", nurse);
  //         console.log("location ", nurse.location.latitude.toString());
  //         // let nurseLatLng = new google.maps.LatLng(nurse.location.latitude, nurse.location.longitude);
  //         // let distance = google.maps.geometry.spherical.computeDistanceBetween(this.yourLatLng, nurseLatLng);
  //         // google.maps.geometry.poly.containsLocation(nurse.location, this.myCircle);
  //         if (this.getDistanceFromLatLonInKm(this.latitude,this.longitude,nurse.location.latitude,nurse.location.longitude) <= this.radius) {
  //           let nurseMarker = {
  //             no: dem,
  //             name: nurse.username,
  //             lat: nurse.location.latitude,
  //             lng: nurse.location.longitude,
  //             // distance: distance,
  //             draggable: false
  //           }
  //           dem++;
  //           console.log("Nurse Marker ", nurseMarker);
  //           this.markers.push(nurseMarker);
  //         }

  //       });  
  //     });
  // }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
  }

  private checkOverlap(start1: number, start2: number, end1: number, end2: number): boolean {
    console.log("Vô");
    if (Math.max(start1, start2) <= Math.min(end1, end2))
      return true;
    else return false;
  }

  private checkBusyDates(busyDates: BusyDate[]) {
    let busyDays = 0;
    let dem = 0;
    console.log("Busy_dates" + busyDates);
    busyDates.forEach( busyDate => {
      console.log("Busy_dates start time" + busyDate.start_time);
      let startOldTime = new Date(busyDate.start_time);
      let startNewTime = new Date();
      startNewTime.setHours(startOldTime .getHours());
      startNewTime.setMinutes(startOldTime .getMinutes());
      startNewTime.setSeconds(0);
      // this.testSt = startNewTime;
      let endOldTime = new Date(busyDate.end_time);
      let endNewTime = new Date();
      endNewTime.setHours(endOldTime .getHours());
      endNewTime.setMinutes(endOldTime .getMinutes());
      endNewTime.setSeconds(0);
      // this.testEn = endNewTime;      
      console.log("Burse Time " + busyDate.date +"|"+ startNewTime.getMinutes() + "|" + endNewTime.getMinutes());
      switch (busyDate.date) {
        case "T2":
        if (this.monSt !== undefined && this.monEn !==undefined)
          if (this.checkOverlap(this.monSt.getTime(), startNewTime.getTime(), this.monEn.getTime(), endNewTime.getTime()))
            dem++;
          break;
        case "T3":
        if (this.tueSt !== undefined && this.tueEn !==undefined)
          if (this.checkOverlap(this.tueSt.getTime(), startNewTime.getTime(), this.tueEn.getTime(), endNewTime.getTime()))
            dem++;
          break;
        case "T4":
        if (this.wedSt !== undefined && this.wedEn !==undefined)
          if (this.checkOverlap(this.wedSt.getTime(), startNewTime.getTime(), this.wedEn.getTime(), endNewTime.getTime()))
            dem++;        
          break;
        case "T5":
        if (this.thuSt !== undefined && this.thuEn !==undefined)
          if (this.checkOverlap(this.thuSt.getTime(), startNewTime.getTime(), this.thuEn.getTime(), endNewTime.getTime()))
            dem++;  
          break;
        case "T6":
        if (this.friSt !== undefined && this.friEn !==undefined)
          if (this.checkOverlap(this.friSt.getTime(), startNewTime.getTime(), this.friEn.getTime(), endNewTime.getTime()))
            dem++;          
          break;
        case "T7":
        if (this.satSt !== undefined && this.satEn !==undefined)
          if (this.checkOverlap(this.satSt.getTime(), startNewTime.getTime(), this.satEn.getTime(), endNewTime.getTime()))
            dem++;          
          break;
        case "CN":
        if (this.sunSt !== undefined && this.sunEn !==undefined)
          if (this.checkOverlap(this.sunSt.getTime(), startNewTime.getTime(), this.sunEn.getTime(), endNewTime.getTime()))
            dem++;          
          break;                    
      }
    });
    console.log("Dem:"+dem);
    // if (dem <= this.numberBusyDateAllow) return false; else return true;
    return dem <= this.numberBusyDateAllow ? false : true;
    
  }

  private lockRegionForCurrentUser() {
    var polygonC = new google.maps.Polygon({
        paths: this.pathsCenter,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      });
    var polygonT = new google.maps.Polygon({
        paths: this.pathsTop,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      }); 
    var polygonB = new google.maps.Polygon({
        paths: this.pathsBottom,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      }); 
    var polygonL = new google.maps.Polygon({
        paths: this.pathsLeft,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      });
    var polygonR = new google.maps.Polygon({
        paths: this.pathsRight,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      });                            
    let nurseLatLng = new google.maps.LatLng(this.latitude, this.longitude);
    let ft = false;
    ft = google.maps.geometry.poly.containsLocation(nurseLatLng, polygonC);
    console.log("PolygonC:" + ft);
    if (ft) {
      this.paths = this.pathsCenter;
      return "C";   
    }
      
    ft = google.maps.geometry.poly.containsLocation(nurseLatLng, polygonT);
    console.log("PolygonT:" + ft);
    if (ft) {
      this.paths = this.pathsTop;
      return "T";   
    }    
    ft = google.maps.geometry.poly.containsLocation(nurseLatLng, polygonB);
    console.log("PolygonB:" + ft);   
    if (ft) {
      this.paths = this.pathsBottom;
      return "B";   
    } 
    ft = google.maps.geometry.poly.containsLocation(nurseLatLng, polygonL);
    console.log("PolygonL:" + ft);   
    if (ft) {
      this.paths = this.pathsLeft;
      return "L";   
    }
    ft = google.maps.geometry.poly.containsLocation(nurseLatLng, polygonR);
    console.log("PolygonR:" + ft);   
    if (ft) {
      this.paths = this.pathsRight;
      return "R";   
    }

    return "X";
  }

  private lockRegionForNurse(s: string, nurse: any) {
    let nurseLatLng = new google.maps.LatLng(nurse.owner.location.latitude, nurse.owner.location.longitude);
    let ft = false;
    switch(s) {
      case 'C':
        var polygonC = new google.maps.Polygon({
            paths: this.pathsCenter,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
          });
          ft = google.maps.geometry.poly.containsLocation(nurseLatLng, polygonC);
          console.log("PolygonC:" + ft);
          break;            
      case 'T':
        var polygonT = new google.maps.Polygon({
          paths: this.pathsTop,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        });
          ft = google.maps.geometry.poly.containsLocation(nurseLatLng, polygonT);
          console.log("PolygonT:" + ft);
          break;    
      case 'B':
        var polygonB = new google.maps.Polygon({
            paths: this.pathsBottom,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
          }); 
        ft = google.maps.geometry.poly.containsLocation(nurseLatLng, polygonB);
        console.log("PolygonB:" + ft);   
        break;

      case 'L':
        var polygonL = new google.maps.Polygon({
            paths: this.pathsLeft,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
          });      
        ft = google.maps.geometry.poly.containsLocation(nurseLatLng, polygonL);
        console.log("PolygonL:" + ft);   
        break;
          
      case 'R':
        var polygonR = new google.maps.Polygon({
            paths: this.pathsRight,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
          });
        ft = google.maps.geometry.poly.containsLocation(nurseLatLng, polygonR);
        console.log("PolygonR:" + ft); 
        break;    

      case 'X':
        ft = false;
        console.log("PolygonX:" + ft); 
        break;           
    }
    return ft;
  }

  private loadAllNurseOnTheMap() {
      this.markers.length = 0;
      // this.markers = [];

      this.markerNo= undefined;
      this.markerName= undefined;
      this.markerEmail= undefined;
      this.markerPhone= undefined;
      this.markerSex= undefined;
      this.markerAge= undefined;
      this.markerAddress= undefined;
      this.markerHospital= undefined;
      this.markerLat= undefined;
      this.markerLng= undefined;


      this.nursesService.search(this.searchCriteriaCareer.value, this.searchCriteriaType.value, this.searchCriteriaHospital.value)
        .takeWhile(() => this.alive)
        .subscribe(nurses => { 
          // this.nurseProfiles = nurses;
          this.nurseProfiles = [];

          let dem = 0;
          
          nurses.forEach(nurse => {
          console.log("Nurse ", nurse);
          console.log("location ", nurse.owner.location.latitude.toString());

          switch(this.searchMode.value) {
            case "nearby":
              // for old mode
              if (this.getDistanceFromLatLonInKm(this.latitude,this.longitude,nurse.owner.location.latitude,nurse.owner.location.longitude) <= this.radius) {
                // console.log("Busy_dates" + nurse.busy_dates);
                let isBusy = false;
                if (nurse.busy_dates.length !== 0 )
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
                    // distance: distance,
                    draggable: false
                  }
                  dem++;
                  console.log("Nurse Marker ", nurseMarker);
                  this.markers.push(nurseMarker);
                  this.nurseProfiles.push(nurse);
                }

              };
              break;
            case "sector":            
              // for new mode
              if (this.lockRegionForNurse(this.pathsSelect, nurse)) {
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
                  // distance: distance,
                  draggable: false
                }
                dem++;
                console.log("Nurse Marker ", nurseMarker);
                this.markers.push(nurseMarker);
                this.nurseProfiles.push(nurse);
              };
              break;
          }
        });  
        dem = 0;
      });
  }


  
  ngOnDestroy() {
    this.alive = false;
  }
  
}


  interface marker {
    no: number;
    name?: string;
    email?: string;
    phone?: number;   
    sex?: string;
    age?: string;
    address?: string;
    hospital?: string;
    lat: number;
    lng: number;
    label?: string;
    // distance?: number;
    draggable: boolean;
    animation?: any;
}