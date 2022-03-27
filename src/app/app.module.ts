import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './account/sign-up/sign-up.component';
import { SignInComponent } from './account/sign-in/sign-in.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { BackendProvider } from './helpers/backend';
import { AlertComponent } from './_components';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component';
import { MapsAPILoader } from '@agm/core';
import { AgmCoreModule } from '@agm/core';



@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    HomeComponent,
    UsersComponent,   
    AlertComponent, ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    AgmCoreModule.forRoot({
      apiKey:'AIzaSyAehe8kkiQMte4oMUPtlBkjbdrHpjLz7x0',
      libraries: ['places']
    })

  ],
  exports:[
    AlertComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  entryComponents:[ModalComponent],
  providers: [
  //  { provide: HTTP_INTERCEPTORS,useClass:JwtInterceptor, multi:true},
  //  {provide: HTTP_INTERCEPTORS, useClass:ErrorInterceptor, multi:true},
  //  BackendProvider
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
