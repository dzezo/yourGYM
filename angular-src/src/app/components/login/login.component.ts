import { Component, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
	// ngModel
	username: String;
	password: String;

  // Background
  backgroundElement: any;
  footerSize: any = 30;

  // Error
  error: Boolean = false;
  errorMsg: String;
  constructor(
  			private authService: AuthService,
  			private router: Router,
        private elRef: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.backgroundElement = $(this.elRef.nativeElement).find('.login-background');
    var contentOffset = this.backgroundElement.offset();
    this.backgroundElement.css('min-height', (window.innerHeight - contentOffset.top - this.footerSize) + 'px');
  }

  // Events

  @HostListener("window:resize", [])
  onWindowsResize(){
    var contentOffset = this.backgroundElement.offset();
    this.backgroundElement.css('min-height', (window.innerHeight - contentOffset.top - this.footerSize) + 'px');
  }
  @HostListener("window:load", [])
  onWindowsLoad(){
    // Offset (Refresh & Direct Load)
    var contentOffset = this.backgroundElement.offset();
    this.backgroundElement.css('min-height', (window.innerHeight - contentOffset.top - this.footerSize) + 'px');
  }

  // Methods

  onLoginSubmit(){
  	var user = {
  		username: this.username,
  		password: this.password
  	}

  	this.authService.authenticateUser(user).subscribe(data =>{
  		if(data.success){
  			this.authService.storeUserData(data.token, data.user);
  			this.router.navigate(['/dashboard']);
  		}
  		else {
        this.errorMsg = data.msg;
        this.error = true;
  			this.router.navigate(['/login']);
  		}
  	});
  }
}
