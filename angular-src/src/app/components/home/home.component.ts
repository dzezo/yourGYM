import { Component, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  backgroundElement: any;
  footerSize: any = 30;
  constructor(private elRef: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.backgroundElement = $(this.elRef.nativeElement).find('.home-background');
    var contentOffset = this.backgroundElement.offset();
    this.backgroundElement.css('height', (window.innerHeight - contentOffset.top - this.footerSize) + 'px');
  }

  // Events

  @HostListener("window:resize", [])
  onWindowsResize(){
    var contentOffset = this.backgroundElement.offset();
    this.backgroundElement.css('height', (window.innerHeight - contentOffset.top - this.footerSize) + 'px');
  }
  @HostListener("window:load", [])
  onWindowsLoad(){
    // Offset (Refresh & Direct Load)
    var contentOffset = this.backgroundElement.offset();
    this.backgroundElement.css('height', (window.innerHeight - contentOffset.top - this.footerSize) + 'px');
  }

}
