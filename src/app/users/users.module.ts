import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountComponent } from './account/account.component';
import { AgmCoreModule, AgmMap, MapsAPILoader} from '@agm/core';
import { SharedModule } from '../shared/shared.module';
import { TimeoutComponent } from './timeout/timeout.component';



@NgModule({
  declarations: [
    LayoutComponent,
    ListComponent,
    AddEditComponent,
    AccountComponent,
    TimeoutComponent,

  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    NgxPaginationModule,
    SharedModule,
    FormsModule,ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey:'AIzaSyAehe8kkiQMte4oMUPtlBkjbdrHpjLz7x0',
      
    })
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [
    //  { provide: HTTP_INTERCEPTORS,useClass:JwtInterceptor, multi:true},
    //  {provide: HTTP_INTERCEPTORS, useClass:ErrorInterceptor, multi:true},
    //  BackendProvider
    // GoogleMapsAPIWrapper,
    
    ],
  entryComponents:[AddEditComponent, TimeoutComponent]
})
export class UsersModule { }
