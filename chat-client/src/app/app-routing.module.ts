import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsLoggedInGuard } from './guards/is-logged-in.guard';
import { IsNotLoggedInGuard } from './guards/is-not-logged-in.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [IsLoggedInGuard], // <1>
    children: [
      {path: '', redirectTo: 'select-room', pathMatch: 'full'},
      {path: 'chat-room', loadChildren: './pages/chat-room/chat-room.module#ChatRoomPageModule'},
      {path: 'select-room', loadChildren: './pages/select-room/select-room.module#SelectRoomPageModule'}
    ]
  },
  {path: 'login', loadChildren: './pages/login/login.module#LoginPageModule', canActivate: [IsNotLoggedInGuard]}, // <2>
  {path: 'sign-up', loadChildren: './pages/sign-up/sign-up.module#SignUpPageModule', canActivate: [IsNotLoggedInGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
