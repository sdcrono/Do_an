import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, IonicPage, App } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/index';

// declare var google;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  start = 'chicago, il';
  end = 'chicago, il';
  // directionsService = new google.maps.DirectionsService;
  // directionsDisplay = new google.maps.DirectionsRenderer;

  userDetails: any;
  responseData: any;

  userPostData = { "user_id": "", "token": "" };


  currentUser: any;
  // nurses: Nurse[] = [];
  // nurseProfiles: NurseProfile[] = [];
  locations: Location;


  latitude: number;
  longitude: number;
  address: string;
  radius: number; // meter

  style = [{ "featureType": "landscape", "stylers": [{ "saturation": -100 }, { "lightness": 65 }, { "visibility": "on" }] }, { "featureType": "poi", "stylers": [{ "saturation": -100 }, { "lightness": 51 }, { "visibility": "simplified" }] }, { "featureType": "road.highway", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "road.arterial", "stylers": [{ "saturation": -100 }, { "lightness": 30 }, { "visibility": "on" }] }, { "featureType": "road.local", "stylers": [{ "saturation": -100 }, { "lightness": 40 }, { "visibility": "on" }] }, { "featureType": "transit", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "administrative.province", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": -25 }, { "saturation": -100 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "hue": "#ffff00" }, { "lightness": -25 }, { "saturation": -97 }] }];
  styles = [{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] }, { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] }, { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] }];
  

  zoom: number;
  icon: string;

  constructor(public navCtrl: NavController, public authService: AuthServiceProvider, public app: App) {
    // const data = JSON.parse(localStorage.getItem('userData'));
    // this.userDetails = data.userData;
    // this.userPostData.user_id = this.userDetails.user_id;
    // this.userPostData.token = this.userDetails.token;
  }

  ionViewDidLoad() {
    this.initMap();
  }

  initMap() {
    // //get current user
    // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // //set google maps defaults
    // this.zoom = 13;
    // this.latitude = this.currentUser.lat === undefined ? 10.778285 : this.currentUser.lat;
    // this.longitude = this.currentUser.lng === undefined ? 106.697806 : this.currentUser.lng;
    // this.radius = 5000;
    
    // // this.yourLatLng = new google.maps.LatLng(this.latitude, this.longitude);
    // this.map = new google.maps.Map(this.mapElement.nativeElement, {
    //   zoom: this.zoom,
    //   center: { lat: this.latitude, lng: this.longitude },
    //   mapTypeId: google.maps.MapTypeId.ROADMAP,
    //   styles: this.styles,
    //   disableDoubleClickZoom: false,
    //   disableDefaultUI: true,
    //   zoomControl: true,
    //   scaleControl: true,
    // });
    // this.directionsDisplay.setMap(this.map);

    
  }

  // calculateAndDisplayRoute() {
  //   this.directionsService.route({
  //     origin: this.start,
  //     destination: this.end,
  //     travelMode: 'DRIVING'
  //   }, (res, status) => {
  //     if (status === 'OK') {
  //       this.directionsDisplay.setDirections(res);
  //     } else {
  //       window.alert('Direction request failed due to ' + status);
  //     }
  //   });
  // }

  backToWelcome() {
    const root = this.app.getRootNav();
    root.popToRoot();
  }

  logout() {
    localStorage.clear();
    setTimeout(() => this.backToWelcome(), 1000);
  }

}
