import { Component, OnInit, AfterViewInit, ElementRef, HostListener} from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MembersService } from '../../services/members.service';
import { PricelistService } from '../../services/pricelist.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  // User
  user: any;
  // Member
  memberId: String;
  memberships: Array<any>;
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
  // Modal Vars
  membershipId: String = "";
  membershipType: String = "Select Membership";
  membershipCost: String = "0";
  // Error Flags
  errorType: Boolean = false;
  errorDate: Boolean = false;
  constructor(private memSvc: MembersService,
              private pricelistSvc: PricelistService,
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
  }

  ngAfterViewInit(){
    this.editModal = $(this.elRef.nativeElement).find('#edit-member-modal');
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
}
