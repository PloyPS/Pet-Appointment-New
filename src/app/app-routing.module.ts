import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { AppointmentComponent } from './page/appointment/appointment.component';
import { ManagePetComponent } from './page/manage-pet/manage-pet.component';
import { ManageUserComponent } from './page/manage-user/manage-user.component';

const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
      path: 'appointment',
      component: AppointmentComponent,
      // canActivate: [authGuard],
  },
  {
      path: 'manage-pet',
      component: ManagePetComponent,
      // canActivate: [authGuard],
  },
  {
      path: 'manage-user',
      component: ManageUserComponent,
      // canActivate: [authGuard],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
