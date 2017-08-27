import { Component, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
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
	constructor(private validateService: ValidateService,
				private flashMessage: FlashMessagesService,
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
			this.flashMessage.show('Please fill in all the fields.', {cssClass: 'alert-danger', timeout: 3000});
			return false;
		}

		// Validate Email
		if(!this.validateService.validateEmail(user.email)){
			this.flashMessage.show('Please use a valid e-mail.', {cssClass: 'alert-danger', timeout: 3000});
			return false;
		}

		// Register User
		this.authService.registerUser(user).subscribe((data) => {
			if(data.success){
				this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
				this.router.navigate(['/login']);
			}
			else{
				this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
				this.router.navigate(['/register']);
			}
		});
	}

}
