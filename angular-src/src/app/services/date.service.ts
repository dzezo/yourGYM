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
				if(this.initDate.getDate() != currentDay)
					callback(true);
			}, 1000);
		}
	}

	updateDate(userId){
		var update = {
			date: Date.now()
		}
		var headers = new Headers();
	    headers.append('Content-Type', 'application/json');
	    return this.http.put('http://localhost:3000/members/' + userId, JSON.stringify(update), {headers: headers})
	      .map(res => res.json());
	}
}
