import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './page/login/login.component';
import { AppointmentComponent } from './page/appointment/appointment.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ManagePetComponent } from './page/manage-pet/manage-pet.component';
import { ManageUserComponent } from './page/manage-user/manage-user.component';
import { CardModule } from 'primeng/card';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AppointmentComponent,
    NavbarComponent,
    ManagePetComponent,
    ManageUserComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    InputTextModule,
    ButtonModule,
    ToolbarModule,
    AvatarModule,
    AvatarGroupModule,
    TableModule,
    DialogModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
    InputTextareaModule,
    CommonModule,
    FileUploadModule,
    DropdownModule,
    TagModule,
    MultiSelectModule,
    RadioButtonModule,
    RatingModule,
    FormsModule,
    CalendarModule,
    InputNumberModule,
    ReactiveFormsModule,
    HttpClientModule,
    CardModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent },
      { path: 'appointment', component: AppointmentComponent },
    ]),
  ],

  providers: [ConfirmationService, MessageService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
