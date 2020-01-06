import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PricelistService {

	constructor(private http: Http) { }

	// Pricelist

	getPricelist(userId){
		return this.http.get('pricelists/' + userId)
		.map(res => res.json());
	}

	addItemToPricelist(userId, newItem){
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post('pricelists/' + userId, JSON.stringify(newItem), {headers: headers})
      	.map(res => res.json());
	}

	deleteItemFromPricelist(itemId){
		return this.http.delete('pricelists/item/' + itemId)
      	.map(res => res.json());
	}
	
	updateItemFromPricelist(itemId, newItem){
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.put('pricelists/item/' + itemId, JSON.stringify(newItem), {headers: headers})
      	.map(res => res.json());
	}

}
