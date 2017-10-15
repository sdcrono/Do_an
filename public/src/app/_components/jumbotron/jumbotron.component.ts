import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/index';

@Component({
  moduleId:module.id,
  selector: 'jumbotron',
  templateUrl: './jumbotron.component.html',
  styleUrls: ['./jumbotron.component.css']
})
export class JumbotronComponent implements OnInit {

  private heading: string;
  private text: string;
  private btnText: string;
  private btnUrl: string;
  currentUser: User;
  constructor() { }

  ngOnInit() {
    this.heading = "Ahuhu.com";
    this.text = "by ZAX";
    this.btnText = "Read more";
    this.btnUrl = "/about";
    this.currentUser = undefined;
    // console.log(this.currentUser.role);
  }

}
