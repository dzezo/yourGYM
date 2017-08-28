import { Component, OnInit, AfterViewInit, ElementRef, HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MembersService } from '../../services/members.service';
import { PricelistService } from '../../services/pricelist.service';
import { DateService } from '../../services/date.service';


declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  // General
  user: any;
  memberId: String;
  // Pricelist items []
  membershipTypes: Array<any>;
  // Membership history for memberId
  memberships: Array<any>;
  // payment for paymentFor (membershipId)
  paymentFor: any;
  // Member Info
  memberName: any;
  memberPhone: any;
  memberMail: any;
  memberDebt: any;
  // Sidebar
  contentContainer: any;
  sidebarWrapper: any;
  sidebar: any;
  sidebarOffset: any;
  // Modals
  editModal: any;
  membershipModal: any;
  paymentModal: any;
  // Modal Vars
  membershipId: String = "";
  membershipType: String = "Select Membership";
  membershipCost: String = "0";
  // Error Flags
  errorType: Boolean = false;
  errorDate: Boolean = false;

  constructor(private memSvc: MembersService,
              private pricelistSvc: PricelistService,
              private dateSvc: DateService,
              private flashMessage: FlashMessagesService,
              private elRef: ElementRef,
              private router: Router) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.memberId = localStorage.getItem('member');
    if(!this.memberId){
      // No memberId in local storage
      this.router.navigate(['/dashboard']);
    }
    this.getMember(this.memberId);
    this.getPricelist();
    this.trackDate();
  }

  ngAfterViewInit(){
    // Modals
    this.editModal = $(this.elRef.nativeElement).find('#edit-member-modal');
    this.membershipModal = $(this.elRef.nativeElement).find('#new-membership-modal');
    this.paymentModal = $(this.elRef.nativeElement).find('#payment-modal');
    // Sidebar
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

  // Init Methods

  trackDate(){
    this.dateSvc.startDateService(Date.now());
    // OnLoad Update
    if(!this.dateSvc.startedTracking)
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
        this.getMember(this.memberId);
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

  getMember(memberId){
    this.memSvc.getMember(memberId).subscribe(member => {
      // Invalid ID
      if(!member){
        localStorage.removeItem('member');
        this.router.navigate(['/dashboard']);
        return false;
      }
      // Incorrect ID
      else if(member.success == false){
        localStorage.removeItem('member');
        this.router.navigate(['/dashboard']);
        return false;
      }
      // Wrong Member
      else if(this.user.id != member.userId){
        localStorage.removeItem('member');
        this.router.navigate(['/dashboard']);
        return false;
      }
      // Valid
      else{
        // Informations
        this.memberName = member.name;
        this.memberPhone = member.phone;
        this.memberMail = member.email;
        this.memberDebt = member.totalDebt;
        // Memberships
        this.memberships = member.memberships;
      }
    }, err => {
      console.log(err);
      return false;
    });
  }

  // Methods
  resetErrorFlags(){
    // Reset prev. errors
    this.errorType = false;
    this.errorDate = false;  
  }

  payment(membershipId){
    this.paymentFor = membershipId;
    // Reset prev. error
    this.errorDate = false;
  }

  updateMember(name, phone, mail){
    var update = {
      name: name,
      phone: phone,
      email: mail
    };
    this.memSvc.updateMember(this.memberId, update).subscribe(updatedMember =>{
      if(updatedMember.success){
        // Turn off modal
        this.editModal.modal('hide');
        this.flashMessage.show(updatedMember.msg, {cssClass: 'alert-success', timeout: 3000});
        this.memberName = updatedMember.member.name;
        this.memberPhone = updatedMember.member.phone;
        this.memberMail = updatedMember.member.email;
      }
      else{
        // Turn off modal
        this.editModal.modal('hide');
        this.flashMessage.show(updatedMember.msg, {cssClass: 'alert-danger', timeout: 3000});
        return false;
      }
    }, err =>{
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

  membershipSelected(pricelistId, name, cost){
    this.membershipId = pricelistId;
    this.membershipType = name;
    this.membershipCost = cost.toString();
  }

  addNewMembership(start, amount){
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

    const newMembership = {
      start: start+'T00:00:00Z',
      membershipId: this.membershipId,
      amount: parseInt(amount),
      submitTime: Date.now()
    };

    this.memSvc.addNewMembership(this.memberId, newMembership).subscribe(data => {
      if(data.success){
        // Turn off modal
        this.membershipModal.modal('hide');
        // Send msg
        this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
        // Update view
        this.memberships.unshift(data.member.memberships[0]);
        this.memberDebt = data.member.totalDebt;
      }
      else {
        // Turn off modal
        this.membershipModal.modal('hide');
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
      }
    }, err => {
      console.log(err);
      return false;
    });
  }

  removeMembership(membershipId){
    this.memSvc.removeMembership(this.memberId, membershipId).subscribe(data => {
      if(data.success){
        for(var i=0; i<this.memberships.length;i++){
          if(this.memberships[i]._id == membershipId)
            this.memberships.splice(i,1);
        }
        this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
        // Update statistics
        this.memberDebt = data.newTotalDebt;
      }
      else {
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
      }
    }, err => {
      console.log(err);
      return false;
    });
  }

  addNewPayment(payDate, amount){
    if(!payDate){
      this.errorDate = true;
      return false;
    }
    else
      this.errorDate = false;

    const newPayment = {
      date: payDate + 'T00:00:00Z',
      amount: parseInt(amount)
    };

    this.memSvc.addPayment(this.memberId, this.paymentFor, newPayment).subscribe(data => {
      if(data.success){
        // Turn off modal
        this.paymentModal.modal('hide');
        // Send msg
        this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
        // Update view 
        this.memberDebt = data.member.totalDebt;
        for(var i=0; i<this.memberships.length; i++){
          if(this.memberships[i]._id == this.paymentFor){
            this.memberships[i].debt = data.member.memberships[i].debt;
            this.memberships[i].log.unshift(data.member.memberships[i].log[0]);
          }
        }
      }
      else {
        // Turn off modal
        this.paymentModal.modal('hide');
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
      }
    }, err => {
      console.log(err);
      return false;
    });
  }
  
  removePayment(membershipId, paymentId){
    this.memSvc.removePayment(this.memberId, membershipId, paymentId).subscribe(data => {
      if(data.success){
        for(var i=0; i<this.memberships.length;i++)
          // Find membership
          if(this.memberships[i]._id == membershipId)
            for(var j=0; j<this.memberships[i].log.length; j++)
              // Find payment log
              if(this.memberships[i].log[j]._id == paymentId)
                this.memberships[i].log.splice(j,1);
        this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
        // Update view
        this.memberDebt = data.member.totalDebt;
        for(var i=0; i<this.memberships.length; i++){
          if(this.memberships[i]._id == membershipId){
            this.memberships[i].debt = data.member.memberships[i].debt;
          }
        }
      }
      else {
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
      }
    }, err => {
      console.log(err);
      return false;
    });
  }
}
