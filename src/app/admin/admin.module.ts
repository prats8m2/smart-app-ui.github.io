import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { FullCalendarModule } from '@fullcalendar/angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LightboxModule } from 'ngx-lightbox';
import { SimplebarAngularModule } from 'simplebar-angular';

// Emoji Picker
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { HttpClientModule } from '@angular/common/http';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardsModule } from './dashboards/dashboards.module';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		FormsModule,
		BsDropdownModule.forRoot(),
		ModalModule.forRoot(),
		AdminRoutingModule,
		NgApexchartsModule,
		ReactiveFormsModule,
		DashboardsModule,
		HttpClientModule,
		FullCalendarModule,
		TabsModule.forRoot(),
		TooltipModule.forRoot(),
		CollapseModule.forRoot(),
		SimplebarAngularModule,
		LightboxModule,
		PickerModule,
	],
})
export class AdminModule {}
