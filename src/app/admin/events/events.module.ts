import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEventComponent } from './add-event/add-event.component';
import { ListEventComponent } from './list-event/list-event.component';
import { ViewEventComponent } from './view-event/view-event.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxQrcodeStylingModule } from 'ngx-qrcode-styling';
import { SharedModule } from 'src/app/shared/shared.module';
import { EventRoutingModule } from './events-routing.module';

@NgModule({
	declarations: [
		AddEventComponent,
		ListEventComponent,
		ViewEventComponent,
		EditEventComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		PaginationModule.forRoot(),
		NgSelectModule,
		SharedModule,
		NgxQrcodeStylingModule,
		EventRoutingModule,
	],
})
export class EventsModule {}
