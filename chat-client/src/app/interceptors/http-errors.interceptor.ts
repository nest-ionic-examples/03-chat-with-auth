import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { EMPTY, throwError } from 'rxjs';
import { NavController, ToastController } from '@ionic/angular';
import { LoggedInService } from '../services/logged-in.service';

@Injectable()
export class HttpErrorsInterceptor implements HttpInterceptor {
  constructor(private navCtrl: NavController,
              private toastCtrl: ToastController,
              private loggedInSvc: LoggedInService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    return next.handle(req).pipe(catchError(async errorResp => {

      const message = errorResp.error && errorResp.error.message || errorResp.message;

      (await this.toastCtrl.create({
        message,
        position: 'middle',
        buttons: [{text: 'Ok'}],
        duration: 5000
      })).present();

      if (errorResp.status === 401) { // <1>
        this.loggedInSvc.loggedIn$.next(false);
        this.navCtrl.navigateRoot('/login');
        return EMPTY;
      }

      return throwError(errorResp);
    }));
  }
}
