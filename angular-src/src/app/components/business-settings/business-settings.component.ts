import { Component, OnInit, AfterViewInit, ElementRef, HostListener} from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { PricelistService } from '../../services/pricelist.service';
import { DateService } from '../../services/date.service';

declare var $: any;

@Component({
  selector: 'app-business-settings',
  templateUrl: './business-settings.component.html',
  styleUrls: ['./business-settings.component.css']
})
export class BusinessSettingsComponent implements OnInit, AfterViewInit {
	// User
	user: any;
	itemId: any;
	// Arrays
	items: Array <any>;
	// Sidebar
	contentContainer: any;
	sidebarWrapper: any;
	sidebar: any;
	sidebarOffset: any;
	//Add Modal
	addModal: any;
	//Edit Modal
	editModal: any;
	itemName: String = "";
	itemLength: String = "";
	itemCost: String = "";
  	//Error
  	errorName: Boolean = false;
  	errorLength: Boolean = false;
  	errorCost: Boolean = false;
  	
	
	constructor(private elRef: ElementRef,
				private router: Router,
				private flashMessage: FlashMessagesService,
				private priceSvc: PricelistService,
				private dateSvc: DateService,) { }

	ngOnInit() {
		this.user = JSON.parse(localStorage.getItem('user'));
		this.getItems();
		this.trackDate();
	}

  	ngAfterViewInit(){
  		//Modals
  		this.addModal = $(this.elRef.nativeElement).find('#add-item-modal');
  		this.editModal = $(this.elRef.nativeElement).find('#edit-item-modal');
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

	//Methods

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
			if(!result.success){
				console.log(result.msg);
				return false;
			}
	    }, err =>{
	      console.log(err);
	      return false;
	    });
	}

	getItems(){
		this.priceSvc.getPricelist(this.user.id).subscribe(pricelist => {
			this.items = pricelist;
		}, err => {
			console.log(err);
			return false;
		});
	}

	resetErrorFlags(){
		this.errorCost = false;
		this.errorLength = false;
		this.errorName = false;
	}

	addNewItem(name, length, cost){
		//if no name
		if (!name){
			this.errorName = true;
			return false;
		}
		else 
			this.errorName = false;
		//if no length
		if (!length){
			this.errorLength = true;
			return false;
		}
		else 
			this.errorLength = false;
		//if no cost
		if (!cost){
			this.errorCost = true;
			return false;
		}
		else 
			this.errorCost = false;

		const newItem = {
			name: name,
			length: length,
			cost: cost
		};

		this.priceSvc.addItemToPricelist(this.user.id, newItem).subscribe(data => {
			if(data.success){
				this.addModal.modal('hide');
				this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
				this.items.unshift(data.item);
			}
			else {
	  			// Turn off modal
	  			this.addModal.modal('hide');
	  			this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
	  		}
		}, err => {
			console.log(err);
			return false;
		});
	}

	deleteItem(itemId){
		this.priceSvc.deleteItemFromPricelist(itemId).subscribe(data => {
			if(data.success){
				for(var i=0; i<this.items.length; i++){
					if(this.items[i]._id == itemId)
						this.items.splice(i,1);
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

	clickedItem(itemId, name, length, cost){
		this.itemId = itemId;
		this.itemName = name;
		this.itemLength = length;
		this.itemCost = cost;
	}

	updateItem(name, length, cost){
		var update = {
			name: name,
			length: length,
			cost: cost
		};
		this.priceSvc.updateItemFromPricelist(this.itemId, update).subscribe(data =>{
			if(data.success){
				this.editModal.modal('hide');
				for(var i=0; i<this.items.length; i++){
					if(this.items[i]._id == this.itemId)
						this.items[i] = data.item;
				}
				this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
		    }
		    else{
		    	this.editModal.modal('hide');
		        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
		        return false;
		    }        
		}, err =>{
			console.log(err);
			return false;
		});
	}
}