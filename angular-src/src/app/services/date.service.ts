import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { AuthService } from '../services/auth.service';
import 'rxjs/add/operator/map';

@Injectable()
export class DateService {

	started: Boolean = false;
	startedTracking: Boolean = false;
	initDate: any;

	constructor(private http: Http,
				private authService: AuthService) { }

	// Sets init date
	startDateService(initialDate){
		if(!this.started){

			this.started = true;
			this.initDate = new Date(initialDate);
		}
	}
	
	// If date changes do callback
	trackDate(callback){
		if(!this.startedTracking){

			this.startedTracking = true;
			var currentDate;
			var currentDay;

			// Checking
			var checkDate = setInterval(()=>{
				if(!this.authService.loggedIn()){
					this.started = false;
					this.startedTracking = false;
					clearInterval(checkDate);
				}
				currentDate = new Date(Date.now());
				currentDay = currentDate.getDate();
				if(this.initDate.getDate() != currentDay){
					this.initDate = currentDate;
					callback(true);
				}
			}, 1000);
		}
	}

	// date (mm/dd/yyyy)
	reformatDate(date){
		var res = "";
		// Year
		res += date[6];
		res += date[7];
		res += date[8];
		res += date[9];
		res += "-"
		// Month
		res += date[0];
		res += date[1];
		res += "-"
		// Day
		res += date[3];
		res += date[4];
		// Time
		res += "T00:00:00Z"
		return res;
	}

	updateDate(userId){
    var currentDate = new Date(Date.now());
    currentDate.setHours(0,0,0,0);
		var update = {
			date: currentDate
		}
		var headers = new Headers();
	    headers.append('Content-Type', 'application/json');
	    return this.http.put('http://localhost:3000/members/' + userId, JSON.stringify(update), {headers: headers})
	      .map(res => res.json());
	}
}
