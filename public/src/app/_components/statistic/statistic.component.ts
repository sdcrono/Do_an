import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core/services/maps-api-loader/maps-api-loader';
// import { NgZone } from 'angular2-google-chart/node_modules/@angular/core/src/zone/ng_zone';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { AlertService, ContractsService, NursesService, UsersService } from 'app/_services';
import { User } from 'app/_models';
import { Nurse, NurseProfile, Users, Contract } from 'app/_interfaces';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {

  // public bar_ChartData = [
  //   ['City', '2010 Population', '2000 Population'],
  //   ['New York City, NY', 8175000, 8008000],
  //   ['Los Angeles, CA', 3792000, 3694000],
  //   ['Chicago, IL', 2695000, 2896000],
  //   ['Houston, TX', 2099000, 1953000],
  //   ['Philadelphia, PA', 1526000, 1517000]];

  // public bar_ChartOptions = {
  //   title: 'Population of Largest U.S. Cities',
  //   chartArea: { width: '50%' },
  //   hAxis: {
  //     title: 'Total Population',
  //     minValue: 0,
  //     textStyle: {
  //       bold: true,
  //       fontSize: 12,
  //       color: '#4d4d4d'
  //     },
  //     titleTextStyle: {
  //       bold: true,
  //       fontSize: 18,
  //       color: '#4d4d4d'
  //     }
  //   },
  //   vAxis: {
  //     title: 'City',
  //     textStyle: {
  //       fontSize: 14,
  //       bold: true,
  //       color: '#848484'
  //     },
  //     titleTextStyle: {
  //       fontSize: 14,
  //       bold: true,
  //       color: '#848484'
  //     }
  //   }
  // };


  currentUser: User;
  nurses: Nurse[] = [];
  users: any[] = [];
  contracts: any[] = [];
  //Start Position for marker and circle
  public latitude: number;
  public longitude: number;
  public address: string;
  public district: string = "0";
  selectTypeOption;
  searchCriteriaType;
  month: number = new Date().getMonth() + 1;
  year: number = new Date().getFullYear();
  all: boolean = false;
  //Markers
  markers: marker[] = [];

  //style of google map
  public styles = [{ "featureType": "landscape", "stylers": [{ "saturation": -100 }, { "lightness": 65 }, { "visibility": "on" }] }, { "featureType": "poi", "stylers": [{ "saturation": -100 }, { "lightness": 51 }, { "visibility": "simplified" }] }, { "featureType": "road.highway", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "road.arterial", "stylers": [{ "saturation": -100 }, { "lightness": 30 }, { "visibility": "on" }] }, { "featureType": "road.local", "stylers": [{ "saturation": -100 }, { "lightness": 40 }, { "visibility": "on" }] }, { "featureType": "transit", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "administrative.province", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": -25 }, { "saturation": -100 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "hue": "#ffff00" }, { "lightness": -25 }, { "saturation": -97 }] }];

  //Search form
  public searchControl: FormControl;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  //Zoom level
  public zoom: number;
  public icon: string;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private http: HttpModule,
    private router: Router,
    private alertService: AlertService,
    private usersService: UsersService,
    private nursesService: NursesService,
    private contractsService: ContractsService
  ) {
    this.selectTypeOption = [
      {
        id: 1,
        label: "-Chọn thống kê-",
        value: ""
      }, {
        id: 2,
        label: "Thống kê về người tìm kiếm",
        value: "USER"
      }, {
        id: 3,
        label: "Thống kê về người điều dưỡng",
        value: "NURSE"
      }, {
        id: 4,
        label: "Thống kê về yêu cầu",
        value: "REQUEST"
      }
    ];

    this.searchCriteriaType = this.selectTypeOption[1];
  }

  ngOnInit() {
    //get current user
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //set google maps defaults
    console.log("C " + this.currentUser.lat);
    this.zoom = 13;
    this.latitude = this.currentUser.lat === undefined ? 10.778285 : this.currentUser.lat;
    this.longitude = this.currentUser.lng === undefined ? 106.697806 : this.currentUser.lng;

    //load searched nurses
    this.getUserList();
  }

  private getNurseList() {
    this.markers = []
    this.nursesService.search("", "", "")
      // .takeWhile(() => this.alive)
      .subscribe(nurses => {

        let dem = 0;

        nurses.filter(nurse => {
          if (this.all) return nurse;
          const date = new Date(nurse.owner.created_at);
          if (date.getMonth() + 1 === +this.month && date.getFullYear() === this.year) return nurse;
        })
          .forEach(nurse => {
            console.log("Nurse ", nurse);
            console.log("location ", nurse.owner.location.latitude.toString());

            if (nurse.owner.username !== this.currentUser.username && nurse.owner.location.latitude) {
              let nurseMarker = {
                no: dem,
                name: nurse.owner.profile.name,
                email: nurse.owner.profile.email,
                phone: nurse.owner.profile.phone,
                sex: nurse.owner.profile.sex,
                age: nurse.owner.profile.age,
                address: nurse.owner.profile.address,
                lat: nurse.owner.location.latitude,
                lng: nurse.owner.location.longitude,
                // distance: distance,
                draggable: false
              }
              dem++;
              console.log("Nurse Marker ", nurseMarker);
              this.markers.push(nurseMarker);
            }
          });
        dem = 0;
      });
  }

  getUserList() {
    this.markers = []
    this.usersService.getAllNurse().subscribe(users => {
      this.users = users;
      let dem = 0;
      users.filter(user => {
        if (this.all) return user;
        const date = new Date(user.created_at);
        if (date.getMonth() + 1 === +this.month && date.getFullYear() === this.year) return user;
      })
        .forEach(user => {
          let userMarker = {
            no: dem,
            name: user.username,
            email: user.profile.email,
            phone: user.profile.phone,
            sex: user.profile.sex,
            age: user.profile.age,
            address: user.profile.address,
            lat: user.location.latitude,
            lng: user.location.longitude,
            // distance: distance,
            draggable: false
          }
          dem++;
          console.log("Nurse Marker ", userMarker);
          this.markers.push(userMarker);
        })
    });
  }

  getContractList() {
    this.markers = []
    this.contractsService.getAll("", this.currentUser.role, this.currentUser._id).subscribe(contracts => {
      this.contracts = contracts;
      let dem = 0;

      contracts.filter(contract => {
        if (this.all) return contract;
        const date = new Date(contract.created_at);
        if (date.getMonth() + 1 === +this.month && date.getFullYear() === this.year)
          if (this.district === '0')
            return contract;
          else if (contract.district.indexOf(this.district) !== -1)
            return contract;
          else if (this.district === '13' && contract.district.indexOf('1') === -1 && contract.district.indexOf('2') === -1 && contract.district.indexOf('3') === -1
            && contract.district.indexOf('4') === -1 && contract.district.indexOf('5') === -1 && contract.district.indexOf('6') === -1 && contract.district.indexOf('7') === -1
            && contract.district.indexOf('8') === -1 && contract.district.indexOf('9') === -1 && contract.district.indexOf('10') === -1 && contract.district.indexOf('11') === -1
            && contract.district.indexOf('12') === -1 && contract.district.indexOf('Thủ Đức') === -1 && contract.district.indexOf('Gò Vấp') === -1 && contract.district.indexOf('Bình Thạnh') === -1
            && contract.district.indexOf('Tân Bình') === -1 && contract.district.indexOf('Tân Phú') === -1 && contract.district.indexOf('Phú Nhuận') === -1 && contract.district.indexOf('Bình Tân') === -1)
            return contract;
      })
        .forEach(contract => {
          console.log("Contract ", contract);
          let contractMarker = {
            no: dem,
            name: contract.patientName && contract.patientName.toString(),
            age: +contract.patientAge,
            address: contract.address && contract.address.toString(),
            userName: contract.userId.username,
            nurseName: contract.nurseId.username,
            lat: contract.location.latitude,
            lng: contract.location.longitude,
            // distance: distance,
            draggable: false
          }
          dem++;
          console.log("Nurse Marker ", contractMarker);
          this.markers.push(contractMarker);
        });
    });
  }

  onChangeType() {
    switch (this.searchCriteriaType.value) {
      case 'USER':
        this.getUserList();
        break;
      case 'NURSE':
        this.getNurseList();
        break;
      case 'REQUEST':
        this.getContractList();
        break;

    }

  }

  clickedMarker(marker: marker, index: number) {
    console.log("Clicked marker " + marker.name + ' at index ' + index + ' with lat ' + marker.lat + ' lng ' + marker.lng);
  }

  mapClicked($event: any) {
    // console.log("Clicked map");
  }
}

interface marker {
  no: number;
  name?: string;
  email?: string;
  phone?: number;
  sex?: string;
  age?: number;
  address?: string;
  userName?: string;
  nurseName?: string;
  lat: number;
  lng: number;
  label?: string;
  // distance?: number;
  draggable: boolean;
  animation?: any;
}