import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../users/layout/layout.component';
import { AccountComponent } from '../users/account/account.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '', component:LayoutComponent,
    children: [
      {path:'', component:ListComponent },
      {path:'add', component:AddEditComponent},
      {path:'edit/:id', component:AddEditComponent},
      { path:'account', component:AccountComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
