import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListRoleComponent } from './list-role/list-role.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { ViewRoleComponent } from './view-role/view-role.component';

const routes: Routes = [
	{
		path: 'list-roles',
		component: ListRoleComponent,
	},
	{
		path: 'add-role',
		component: AddRoleComponent,
	},
	{
		path: 'edit-role/:id',
		component: EditRoleComponent,
	},
	{
		path: 'view-role/:id',
		component: ViewRoleComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RoleRoutingModule {}
