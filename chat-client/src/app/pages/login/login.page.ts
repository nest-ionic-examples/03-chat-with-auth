import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials = { // <1>
    nickname: '',
    password: ''
  };

  constructor(public authSvc: AuthService) { } // <2>

  ngOnInit() {
  }
}
