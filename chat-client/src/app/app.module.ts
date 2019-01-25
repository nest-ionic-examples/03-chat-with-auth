import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SocketIoModule } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpErrorsInterceptor } from './interceptors/http-errors.interceptor';

// tag::token-getter-fn[]
export function tokenGetter() {
  return sessionStorage.getItem('user_token');
}
// end::token-getter-fn[]

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    // tag::jwt-module[]
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: [environment.baseUrl],
        blacklistedRoutes: ['/login', '/sign-up']
      }
    }),
    // end::jwt-module[]
    // tag::socket-io-module[]
    SocketIoModule.forRoot({
      url: environment.baseUrl,
      options: {
        autoConnect: false
      }
    })
    // end::socket-io-module[]
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: HttpErrorsInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
