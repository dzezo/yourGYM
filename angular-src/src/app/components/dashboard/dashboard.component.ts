import { Component, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MembersService } from '../../services/members.service';

declare var $: any;


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
	// User
	user: any;
	// Arrays
	members: Array<any>;
	membershipTypes: Array<any>;
	// Sidebar
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
	// Statistics
	statMembers: String;
	statActiveMembers: String;
	statIndeptedMembers: String;
	statUnpaidAmount: String;

	constructor(private memSvc: MembersService,
				private flashMessage: FlashMessagesService,
				private router: Router,
				private elRef: ElementRef) { }

	ngOnInit() {
		this.user = JSON.parse(localStorage.getItem('user'));
		this.getStatistics();
		this.getActiveMembers();
		this.getPricelist();
	}

	ngAfterViewInit(){
		this.modal = $(this.elRef.nativeElement).find('#add-member-modal');
		this.sidebarWrapper = $(this.elRef.nativeElement).find('.page-nav-wrapper');
		this.sidebar = $(this.elRef.nativeElement).find('#page-nav');
		// set Height
		this.sidebarWrapper.css('height', (window.innerHeight) + 'px');
		// set Sidebar Offset
		this.sidebarOffset = this.sidebar.offset();
	}

	@HostListener("window:scroll", [])
	onWindowScroll() {
		if(window.scrollY > this.sidebarOffset.top){
			this.sidebar.css('margin-top', window.scrollY - this.sidebarOffset.top);
		}
		else{
			this.sidebar.css('margin-top', 0);
		}
	}
	@HostListener("window:resize", [])
	onWindowsResize(){
		this.sidebarWrapper.css('height', (window.innerHeight) + 'px');
	}

	getStatistics(){
		this.memSvc.getStatistics(this.user.id).subscribe(stats => {
			this.statMembers = JSON.stringify(stats.members);
			this.statActiveMembers = JSON.stringify(stats.activeMembers);
			this.statIndeptedMembers = JSON.stringify(stats.indeptedMembers);
			this.statUnpaidAmount = JSON.stringify(stats.unpaidAmount);
		}, err => {
			console.log(err);
			return false;
		});
	}

	getActiveMembers(){
		this.memSvc.getActiveMembers(this.user.id).subscribe(members => {
			this.members = members;
		}, err => {
			console.log(err);
			return false;
		});
	}

	getPricelist() {
		this.memSvc.getPricelist(this.user.id).subscribe(pricelist => {
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
			amount: parseInt(amount)
		};

		this.memSvc.addNewMember(this.user.id, newMember).subscribe(data => {
			if(data.success){
				// Turn off modal
				this.modal.modal('hide');
				// Send msg
	  			this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
	  			// Update view
	  			this.members.unshift(data.member);
	  			this.getStatistics();
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
			this.getActiveMembers();
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
	  			this.getStatistics();
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
