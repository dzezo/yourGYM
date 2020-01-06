import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';


@Injectable()
export class AuthService {

	authToken: any;
	user: any;

  constructor(private http: Http) { }

  // Register
  registerUser(user){
  	var headers = new Headers();
  	headers.append('Content-Type', 'application/json');
  	return this.http.post('users/register', user, {headers: headers})
    	.map(res => res.json());
  }

  // Login
  authenticateUser(user){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('users/authenticate', user, {headers: headers})
      .map(res => res.json());
  }

  getProfile(){
    var headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('users/profile', {headers: headers})
      .map(res => res.json());
  }

  // Load token from local storage
  loadToken(){
    this.authToken = localStorage.getItem('id_token');
  }

  // Check Login Status
  loggedIn(){
    return tokenNotExpired('id_token');
  }

  // Store authorization token
  storeUserData(token, user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }


  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
