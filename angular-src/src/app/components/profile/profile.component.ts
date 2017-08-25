import { Component, OnInit, AfterViewInit, ElementRef, HostListener} from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  // Sidebar
  contentContainer: any;
  sidebarWrapper: any;
  sidebar: any;
  sidebarOffset: any;

  constructor(private elRef: ElementRef) { }

  ngOnInit() {
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
