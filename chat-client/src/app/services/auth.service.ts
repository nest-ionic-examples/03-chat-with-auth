import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController, ToastController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
import { LoggedInService } from './logged-in.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _currentUser: User; // <1>

  get currentUser(): User { // <2>
    return this._currentUser = this._currentUser || this.jwtHelper.decodeToken();
  }

  constructor(private http: HttpClient,
              private toastCtrl: ToastController,
              private navCtrl: NavController,
              private jwtHelper: JwtHelperService,
              private loggedInSvc: LoggedInService) {} // <3>

  login(credentials) { // <4>
    this.http.post<{token: string}>(environment.apiUrl + 'auth/login', credentials).subscribe(({token}) => {
      sessionStorage.setItem('user_token', token);
      this.loggedInSvc.loggedIn$.next(true);
      this.navCtrl.navigateRoot('/select-room');
    });
  }

  logout() { // <5>
    this.http.post(environment.apiUrl + 'auth/logout', null).subscribe(resp => {
      sessionStorage.removeItem('user_token');
      this.loggedInSvc.loggedIn$.next(false);
      this.navCtrl.navigateRoot('/login');
    });
  }

  signUp(credentials) { // <6>
    this.http.post<{token: string}>(environment.apiUrl + 'auth/sign-up', credentials).subscribe(() => {
      this.navCtrl.navigateRoot('/login');
    });
  }
}
