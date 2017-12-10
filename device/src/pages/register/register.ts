import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/index';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  responseData: any;
  err: any;

  @ViewChild('signupSlider') signupSlider: any;
  slideUserForm: FormGroup;
  slideNurseForm: FormGroup;
  submitUserAttempt: boolean = false;
  submitNurseAttempt: boolean = false;

  userData = { "name": "", "username": "", "password": "", "email": "" };

  nurseData = { "name": "", "username": "", "password": "", "email": "", "type": "" };

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, private alertCtrl: AlertController, public authService: AuthServiceProvider) {
    this.slideUserForm = formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.pattern('[^@]+@[^@]+\.[a-zA-Z]{2,6}')])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      username: ['', Validators.required]
    });

    this.slideNurseForm = formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.pattern('[^@]+@[^@]+\.[a-zA-Z]{2,6}')])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      username: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register() {
    this.submitUserAttempt = true;

    if (!this.slideUserForm.valid) {
      this.signupSlider.slideTo(0);
    }
    else {
      // console.log(this.slideUserForm.value);
      // console.log(this.signupSlider.value);
      this.authService.register(this.userData).subscribe(result => {
        this.responseData = result;
        console.log(this.responseData);
        let alert = this.alertCtrl.create({
          title: 'Register',
          subTitle: 'Register successfully!',
          buttons: ['Okay']
        });
        alert.present();
        console.log("success!")
        this.navCtrl.pop();
      }, err => {
        this.err = err;
        let alert = this.alertCtrl.create({
          title: 'Register',
          subTitle: err,
          buttons: ['Okay']
        });
        alert.present();
        console.log(err);
      });
    }
  }

  signup() {
    this.submitNurseAttempt = true;

    if (!this.slideNurseForm.valid) {
      this.signupSlider.slideTo(1);
    }
    else {
      // console.log(this.slideUserForm.value);
      // console.log(this.signupSlider.value);
      this.authService.signup(this.nurseData).subscribe(result => {
        this.responseData = result;
        console.log(this.responseData);
        let alert = this.alertCtrl.create({
          title: 'Register',
          subTitle: 'Register successfully!',
          buttons: ['Okay']
        });
        alert.present();
        console.log("success!")
        this.navCtrl.push('LoginPage')
      }, err => {
        this.err = err;
        let alert = this.alertCtrl.create({
          title: 'Register',
          subTitle: err,
          buttons: ['Okay']
        });
        alert.present();
        console.log(err);
      });
    }

  }

  login() {
    this.navCtrl.push('LoginPage');
  }

  goback() {
    this.navCtrl.setRoot('LoginPage');
  }

  next() {
    this.signupSlider.slideNext();
  }

  prev() {
    this.signupSlider.slidePrev();
  }

}
