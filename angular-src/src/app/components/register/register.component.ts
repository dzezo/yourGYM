import { Component, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	name: String;
	username: String;
	email: String;
	password: String;


	backgroundElement: any;
  	footerSize: any = 30;

	// Error
	error: Boolean = false;
	errorMsg: String;
	constructor(private validateService: ValidateService,
				private authService: AuthService,
				private router: Router,
				private elRef: ElementRef) { }

	ngOnInit() {
	}

	ngAfterViewInit(){
	    this.backgroundElement = $(this.elRef.nativeElement).find('.register-background');
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


	onRegisterSubmit(){
		const user = {
			name: this.name,
			username: this.username,
			email: this.email,
			password: this.password
		}

		// Required Fields
		if(!this.validateService.validateRegister(user)){
			this.error = true;
			this.errorMsg = 'Please fill in all the fields.';
			return false;
		}

		// Validate Email
		if(!this.validateService.validateEmail(user.email)){
			this.error = true;
			this.errorMsg = 'Please use a valid e-mail.';
			return false;
		}

		// Register User
		this.authService.registerUser(user).subscribe((data) => {
			if(data.success){
				this.router.navigate(['/login']);
			}
			else{
				this.error = true;
				this.errorMsg = data.msg;
				this.router.navigate(['/register']);
			}
		});
	}

}
