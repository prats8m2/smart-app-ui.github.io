import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DeviceRoutingModule } from './device-routing.module';
import { AddDeviceComponent } from './add-device/add-device.component';
import { ListDeviceComponent } from './list-device/list-device.component';
import { EditDeviceComponent } from './edit-device/edit-device.component';
import { ViewDeviceComponent } from './view-device/view-device.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxQrcodeStylingModule } from 'ngx-qrcode-styling';

@NgModule({
	declarations: [
		AddDeviceComponent,
		ListDeviceComponent,
		EditDeviceComponent,
		ViewDeviceComponent,
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		DeviceRoutingModule,
		PaginationModule.forRoot(),
		NgSelectModule,
		SharedModule,
		NgxQrcodeStylingModule,
	],
})
export class DeviceModule {}
