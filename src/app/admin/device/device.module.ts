import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DeviceRoutingModule } from './device-routing.module';
import { AddDeviceComponent } from './add-device/add-device.component';
import { ListDeviceComponent } from './list-device/list-device.component';
import { EditDeviceComponent } from './edit-device/edit-device.component';
import { ViewDeviceComponent } from './view-device/view-device.component';
import { StatusPipe } from 'src/app/core/pipes/status.pipe';
import { KeysPipe } from 'src/app/core/pipes/keys.pipe';

@NgModule({
	declarations: [
		AddDeviceComponent,
		ListDeviceComponent,
		EditDeviceComponent,
		ViewDeviceComponent,
		StatusPipe,
		KeysPipe,
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		DeviceRoutingModule,
		PaginationModule.forRoot(),
	],
})
export class DeviceModule {}
