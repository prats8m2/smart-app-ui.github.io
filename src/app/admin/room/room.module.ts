import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRoomComponent } from './add-room/add-room.component';
import { EditRoomComponent } from './edit-room/edit-room.component';
import { ListRoomComponent } from './list-room/list-room.component';
import { ViewRoomComponent } from './view-room/view-room.component';
import { RoomRoutingModule } from './room-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	declarations: [
		AddRoomComponent,
		EditRoomComponent,
		ListRoomComponent,
		ViewRoomComponent,
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		RoomRoutingModule,
		PaginationModule.forRoot(),
		NgSelectModule,
		SharedModule,
	],
})
export class RoomModule {}
