import { Component, OnInit, AfterViewInit, ElementRef, HostListener} from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MembersService } from '../../services/members.service';
import { PricelistService } from '../../services/pricelist.service';

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
  members: any;
  memberships: Array<any>;
  // Sidebar
  contentContainer: any;
  sidebarWrapper: any;
  sidebar: any;
  sidebarOffset: any;

  constructor(private memSvc: MembersService,
              private pricelistSvc: PricelistService,
              private flashMessage: FlashMessagesService,
              private elRef: ElementRef) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    // Get Member on err dont show content
  }

  ngAfterViewInit(){
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

}
