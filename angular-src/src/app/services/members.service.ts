import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MembersService {

  constructor(private http: Http) { }

  // Dashboard & Members

  getStatistics(userId){
  	var headers = new Headers();
    return this.http.get('http://localhost:3000/members/' + userId + '/statistics', {headers: headers})
      .map(res => res.json());
  }

  getActiveMembers(userId){
  	var headers = new Headers();
    return this.http.get('http://localhost:3000/members/active/' + userId, {headers: headers})
      .map(res => res.json());
  }

  searchByName(userId, name){
  	var headers = new Headers();
    return this.http.get('http://localhost:3000/members/' + userId + '/search/' + name, {headers: headers})
      .map(res => res.json());
  }

  deleteMember(memberId){
  	var headers = new Headers();
    return this.http.get('http://localhost:3000/members/' + memberId, {headers: headers})
      .map(res => res.json());
  }

  // Pricelist

  // Profile
}
