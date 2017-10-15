import { Component, OnInit } from '@angular/core';
import { UsersService } from '../_services/users.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[];
  // users: any = [];
  errr = 'nurse resource';

  constructor(private usersService: UsersService) { }

  getUsers(): void {
      this.usersService.getUsers().then(users => this.users = users);
      // this.userService.getUsers().subscribe(users => this.users = users);
  }

    private loadAllUsers() {
      this.usersService.getAll().subscribe(users => { this.users = users; });
  }

  ngOnInit() {
        // this.postsService.getAllPosts()
    //   .subscribe(
    //     data => {
    //       this.posts = data;
    //       this.errr = "finished";
    //     },
    //     err => this.errr = err,
    //     () => this.errr = 'completed'
    // );
    // this.getUsers();
    this.loadAllUsers();
  }

}
