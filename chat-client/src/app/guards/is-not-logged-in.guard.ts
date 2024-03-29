import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { LoggedInService } from '../services/logged-in.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IsNotLoggedInGuard implements CanActivate {
  constructor(private loggedInSvc: LoggedInService, private navCtrl: NavController) {}

  canActivate(): Observable<boolean> {
    return this.loggedInSvc.loggedIn$.pipe(map(loggedIn => {
      if (loggedIn) {
        this.navCtrl.navigateRoot('/select-room', {replaceUrl: true});
      }
      return !loggedIn;
    }));
  }
}
