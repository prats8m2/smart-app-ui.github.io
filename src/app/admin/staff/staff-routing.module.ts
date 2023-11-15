import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { EditStaffComponent } from './edit-staff/edit-staff.component';
import { ListStaffComponent } from './list-staff/list-staff.component';
import { ViewStaffComponent } from './view-staff/view-staff.component';

const routes: Routes = [
	{
		path: 'list-staffs',
		component: ListStaffComponent,
	},
	{
		path: 'add-staff',
		component: AddStaffComponent,
	},
	{
		path: 'edit-staff/:id',
		component: EditStaffComponent,
	},
	{
		path: 'view-staff/:id',
		component: ViewStaffComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class StaffRoutingModule {}
