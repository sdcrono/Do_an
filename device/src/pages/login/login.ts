import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AuthServiceProvider, UserProvider } from '../../providers/index';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  responseData: any;
  loader: any;
  userData = { "username": "", "password": "" };

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider, public userService: UserProvider,
    private alertCtrl: AlertController, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  signin() {
    if (this.authService.isOnline()) {
      let loader = this.loadingCtrl.create({
        content: "Làm phiền đợi..."
      });
      loader.present();

      setTimeout(() => {
        loader.dismiss().catch();
      }, 1000);

      this.authService.login(this.userData).subscribe(result => {
        this.responseData = result;
        if (!this.responseData.token) {
          let alert = this.alertCtrl.create({
            title: 'Invalid user',
            subTitle: 'Please try again!',
            buttons: ['Okay']
          });
          alert.present();
        } else {
          if (this.responseData.role !== 'ROLE_Employee' && this.responseData.role !== 'ROLE_Admin') {            
            this.authService.getCurrentRegistrationId().then((val) => {
              // console.log("deviceIds", JSON.parse(val))
              let deviceId = JSON.parse(val);
              this.userService.device(this.responseData._id, deviceId).subscribe(data => console.log(data), err => console.log(err))
            }, err => console.log(err));
            // this.userData = { "username": "", "password": "" };
            this.navCtrl.push('MenuPage');
          }
          else {
            let alert = this.alertCtrl.create({
              title: 'Warning',
              subTitle: 'Maybe your username or password is not correct',
              buttons: ['Okay']
            });
            alert.present();
          }
        }
        // loader.dismiss().catch();
      }, err => {
        console.log(err)
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: err.toString(),
          buttons: ['Okay']
        });
        alert.present();
        // loader.dismiss().catch();        
      });
    } else {
      let alert = this.alertCtrl.create({
        title: 'Connection Status',
        subTitle: 'No internet connection',
        buttons: ['Okay']
      });
      alert.present();
    }
  }

  signup() {
    this.navCtrl.push('RegisterPage');
  }

}
