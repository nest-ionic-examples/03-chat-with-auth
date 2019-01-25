import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LoggedInService {

  loggedIn$ = new ReplaySubject<boolean>(1); // <1>

  constructor(socket: Socket, jwtHelper: JwtHelperService) {
    this.loggedIn$.next(!jwtHelper.isTokenExpired()); // <2>

    this.loggedIn$.subscribe(loggedIn => { // <3>
      if (loggedIn) {
        socket.ioSocket.io.opts.query = {token: jwtHelper.tokenGetter()};
        socket.connect();
      } else {
        socket.disconnect();
        sessionStorage.removeItem('user_token');
      }
    });
  }
}
