import { Component, OnInit } from '@angular/core';
import { PostsService } from '../_services/posts.service';
import { User } from '../_models/user';
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  // instantiate posts to an empty array
  // posts: {};
  posts: User[];
  errr = 'nurse resource';

  constructor(private postsService: PostsService) { }

  getUsers(): void {
      // this.userService.getUsers().then(users => this.users = users);
      this.postsService.getUsers().then(users => this.posts = users);
  }

  ngOnInit() {
    // Retrieve posts from the API
    // this.postsService.getAllPosts()
    //   .subscribe(
    //     data => {
    //       this.posts = data;
    //       this.errr = "finished";
    //     },
    //     err => this.errr = err,
    //     () => this.errr = 'completed'
    // );
    this.getUsers();
  }
}
