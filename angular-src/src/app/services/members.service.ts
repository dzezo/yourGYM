import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MembersService {

  constructor(private http: Http) { }

  // Dashboard & Members

  getStatistics(userId){
    return this.http.get('http://localhost:3000/members/' + userId + '/statistics')
      .map(res => res.json());
  }

  getMembers(userId){
    return this.http.get('http://localhost:3000/members/' + userId)
      .map(res => res.json());
  }

  getActiveMembers(userId){
    return this.http.get('http://localhost:3000/members/active/' + userId)
      .map(res => res.json());
  }

  searchByName(userId, name){
    return this.http.get('http://localhost:3000/members/' + userId + '/search/' + name)
      .map(res => res.json());
  }

  deleteMember(memberId){
    return this.http.delete('http://localhost:3000/members/member/' + memberId)
      .map(res => res.json());
  }

  addNewMember(userId, newMember){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/members/' + userId, JSON.stringify(newMember), {headers: headers})
      .map(res => res.json());
  }

  // Profile

   getMember(memberId){
    return this.http.get('http://localhost:3000/members/member/' + memberId)
      .map(res => res.json());
  }

  updateMember(memberId, update){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:3000/members/member/' + memberId, JSON.stringify(update), {headers: headers})
      .map(res => res.json());
  }
}
