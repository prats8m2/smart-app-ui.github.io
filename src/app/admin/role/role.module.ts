import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import { AddRoleComponent } from './add-role/add-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { ViewRoleComponent } from './view-role/view-role.component';
import { ListRoleComponent } from './list-role/list-role.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DefaultRolePipe } from 'src/app/core/pipes/defaultRole.pipe';

@NgModule({
	declarations: [
		AddRoleComponent,
		EditRoleComponent,
		ViewRoleComponent,
		ListRoleComponent,
		DefaultRolePipe,
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		RoleRoutingModule,
		PaginationModule.forRoot(),
	],
})
export class RoleModule {}
