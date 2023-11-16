import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import { AddRoleComponent } from './add-role/add-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { ViewRoleComponent } from './view-role/view-role.component';
import { ListRoleComponent } from './list-role/list-role.component';


@NgModule({
  declarations: [
    AddRoleComponent,
    EditRoleComponent,
    ViewRoleComponent,
    ListRoleComponent
  ],
  imports: [
    CommonModule,
    RoleRoutingModule
  ]
})
export class RoleModule { }
