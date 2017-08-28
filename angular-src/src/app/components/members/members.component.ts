import { Component, OnInit, AfterViewInit, ElementRef, HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MembersService } from '../../services/members.service';
import { PricelistService } from '../../services/pricelist.service';
import { DateService } from '../../services/date.service';

declare var $: any;

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit, AfterViewInit {
	// User
	user: any;
	// Arrays
	members: Array<any>;
	membershipTypes: Array<any>;
	// Sidebar
	contentContainer: any;
	sidebarWrapper: any;
	sidebar: any;
	sidebarOffset: any;
	// Modal vars
	modal: any;
	membershipId: String = "";
	membershipType: String = "Select Membership";
	membershipCost: String = "0";
	errorName: Boolean = false;
	errorType: Boolean = false;
	errorDate: Boolean = false;
	
	constructor(private elRef: ElementRef,
				private pricelistSvc: PricelistService,
				private dateSvc: DateService,
				private flashMessage: FlashMessagesService,
				private router: Router,
				private memSvc: MembersService) { }

	ngOnInit() {
		this.user = JSON.parse(localStorage.getItem('user'));
		this.getMembers();
		this.getPricelist();
		this.trackDate();
	}

	ngAfterViewInit(){
		this.modal = $(this.elRef.nativeElement).find('#add-member-modal');
		this.sidebarWrapper = $(this.elRef.nativeElement).find('.page-nav-wrapper');
		this.sidebar = $(this.elRef.nativeElement).find('#page-nav');
		this.contentContainer = $(this.elRef.nativeElement).find('.container')
		// set Sidebar Height
		this.sidebarWrapper.css('height', (window.innerHeight) + 'px');
		// set Sidebar Offset ( Init & Reroute )
		var contentOffset = this.contentContainer.offset();
		this.sidebarOffset = contentOffset.top - parseInt(this.contentContainer.css('margin-top'), 10);
		// Adjust Scroll ( Init & Reroute )
	    if(window.scrollY > this.sidebarOffset){
	      this.sidebar.css('margin-top', window.scrollY - this.sidebarOffset);
	    }
	    else{
	      this.sidebar.css('margin-top', 0);
	    }
	}

	// Events

	@HostListener("window:scroll", [])
	onWindowScroll() {
		if(window.scrollY > this.sidebarOffset){
			this.sidebar.css('margin-top', window.scrollY - this.sidebarOffset);
		}
		else{
			this.sidebar.css('margin-top', 0);
		}
	}
	@HostListener("window:resize", [])
	onWindowsResize(){
		// Adjust Height
		this.sidebarWrapper.css('height', (window.innerHeight) + 'px');
		// Adjust Offset
		var contentOffset = this.contentContainer.offset();
		this.sidebarOffset = contentOffset.top - parseInt(this.contentContainer.css('margin-top'), 10);
		// Adjust Scroll
		if(window.scrollY > this.sidebarOffset){
			this.sidebar.css('margin-top', window.scrollY - this.sidebarOffset);
		}
		else{
			this.sidebar.css('margin-top', 0);
		}
	}
	@HostListener("window:load", [])
	onWindowsLoad(){
		// set Sidebar Offset ( Refresh & Load )
		var contentOffset = this.contentContainer.offset();
		this.sidebarOffset = contentOffset.top - parseInt(this.contentContainer.css('margin-top'), 10);
	}

	// Methods

	trackDate(){
		this.dateSvc.startDateService(Date.now());
		// OnLoad Update
		this.updateDate();
		// Every next Update
		this.dateSvc.trackDate((dateChanged) =>{
			if(dateChanged)
				this.updateDate();
		});
	}

	updateDate(){
		this.dateSvc.updateDate(this.user.id).subscribe(result =>{
			if(result.success){
				this.getMembers();
		      }
		      else{
		        console.log(result.msg);
		        return false;
		      }
	    }, err =>{
	      console.log(err);
	      return false;
	    });
	}

	getMembers(){
		this.memSvc.getMembers(this.user.id).subscribe(members => { 
				this.members = members;
			}, err => {
				console.log(err);
				return false;
			});
	}

	getPricelist() {
		this.pricelistSvc.getPricelist(this.user.id).subscribe(pricelist => {
			this.membershipTypes = pricelist;
		}, err => {
			console.log(err);
			return false;
		});
	}

	resetErrorFlags(){
		// Reset prev. errors
		this.errorName = false;
		this.errorType = false;
		this.errorDate = false;	
	}

	addNewMember(name, phone, email, start, amount){
		// No name input 
		if(!name){
			this.errorName = true;
			return false;	
		}
		else
			this.errorName = false;
		// No membership selected
		if(!this.membershipId){
			this.errorType = true;
			return false;	
		}
		else
			this.errorType = false;
		// No date selected
		if(!start){
			this.errorDate = true;
			return false;
		}
		else
			this.errorDate = false;

		const newMember = {
			name: name,
			phone: phone,
			email: email,
			start: start+'T00:00:00Z',
			membershipId: this.membershipId,
			amount: parseInt(amount),
			submitTime: Date.now()
		};

		this.memSvc.addNewMember(this.user.id, newMember).subscribe(data => {
			if(data.success){
				// Turn off modal
				this.modal.modal('hide');
				// Send msg
	  			this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
	  			// Update view
	  			this.members.unshift(data.member);
	  		}
	  		else {
	  			// Turn off modal
				this.modal.modal('hide');
	  			this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
	  		}
		}, err => {
			console.log(err);
			return false;
		});
	}

	searchForMember(name){
		if(!name)
			this.getMembers();
		else{
			this.memSvc.searchByName(this.user.id, name).subscribe(srchResults => {
				this.members = srchResults;
			}, err => {
				console.log(err);
				return false;
			});
		}
	}

	deleteMember(memberId){
		this.memSvc.deleteMember(memberId).subscribe(data => {
			if(data.success){
				for(var i=0; i<this.members.length;i++){
					if(this.members[i].id == memberId)
						this.members.splice(i,1);
				}
	  			this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
	  		}
	  		else {
	  			this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
	  		}
		}, err => {
			console.log(err);
			return false;
		});
	}

	getMemberProfile(memberId){
		localStorage.setItem('member',memberId);
		this.router.navigate(['/profile']);
	}

	membershipSelected(pricelistId, name, cost){
		this.membershipId = pricelistId;
		this.membershipType = name;
		this.membershipCost = cost.toString();
	}

}