import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MembersService {

  constructor(private http: Http) { }

  // Dashboard & Members

  getStatistics(userId){
    return this.http.get('members/' + userId + '/statistics')
      .map(res => res.json());
  }

  getMembers(userId){
    return this.http.get('members/' + userId)
      .map(res => res.json());
  }

  getActiveMembers(userId){
    return this.http.get('members/active/' + userId)
      .map(res => res.json());
  }

  searchByName(userId, name){
    return this.http.get('members/' + userId + '/search/' + name)
      .map(res => res.json());
  }

  deleteMember(memberId){
    return this.http.delete('members/member/' + memberId)
      .map(res => res.json());
  }

  addNewMember(userId, newMember){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('members/' + userId, JSON.stringify(newMember), {headers: headers})
      .map(res => res.json());
  }

  // Profile

  getMember(memberId){
    return this.http.get('members/member/' + memberId)
      .map(res => res.json());
  }

  updateMember(memberId, update){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('members/member/' + memberId, JSON.stringify(update), {headers: headers})
      .map(res => res.json());
  }

  addNewMembership(memberId, membership){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('members/member/' + memberId, JSON.stringify(membership), {headers: headers})
      .map(res => res.json());
  }

  removeMembership(memberId, membershipId){
    return this.http.delete('members/member/' + memberId + '/membership/' + membershipId)
      .map(res => res.json());
  }

  addPayment(memberId, membershipId, payment){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('members/member/' + memberId + '/membership/' + membershipId, JSON.stringify(payment), {headers: headers})
      .map(res => res.json());
  }

  removePayment(memberId, membershipId, paymentId){
    return this.http.delete('members/member/' + memberId + '/membership/' + membershipId + '/payment/' + paymentId)
      .map(res => res.json());
  }
}
