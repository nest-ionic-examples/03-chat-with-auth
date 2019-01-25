import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SignUpPage } from './sign-up.page';
import { ValidatorsModule } from 'ngx-validators';

const routes: Routes = [
  {
    path: '',
    component: SignUpPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    // tag::validators-module[]
    ValidatorsModule
    // end::validators-module[]
  ],
  declarations: [SignUpPage]
})
export class SignUpPageModule {}
