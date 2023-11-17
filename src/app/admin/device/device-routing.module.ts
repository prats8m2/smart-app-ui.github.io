import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListDeviceComponent } from './list-device/list-device.component';
import { AddDeviceComponent } from './add-device/add-device.component';
import { EditDeviceComponent } from './edit-device/edit-device.component';
import { ViewDeviceComponent } from './view-device/view-device.component';

const routes: Routes = [
	{
		path: 'list-devices',
		component: ListDeviceComponent,
	},
	{
		path: 'add-device',
		component: AddDeviceComponent,
	},
	{
		path: 'edit-device/:id',
		component: EditDeviceComponent,
	},
	{
		path: 'view-device/:id',
		component: ViewDeviceComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DeviceRoutingModule {}
