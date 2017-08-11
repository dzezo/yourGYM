import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
	user: Object;

  constructor(private router: Router, private authService: AuthService) { }

  // If there is a token in localstorage, 
  // user will be ready for template
  ngOnInit() {
  	this.authService.getProfile().subscribe(profile => {
  		this.user = profile.user;
  	},
  	err => {
  		console.log(err);
  		return false;
  	});
  }

}
