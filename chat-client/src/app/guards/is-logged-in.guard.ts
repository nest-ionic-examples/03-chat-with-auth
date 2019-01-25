import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { LoggedInService } from '../services/logged-in.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {
  constructor(private loggedInSvc: LoggedInService, private navCtrl: NavController) {}

  canActivate(): Observable<boolean> {
    return this.loggedInSvc.loggedIn$.pipe(tap(loggedIn => {
      if (!loggedIn) {
        this.navCtrl.navigateRoot('/login');
      }
    }));
  }
}
