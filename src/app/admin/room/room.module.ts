import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRoomComponent } from './add-room/add-room.component';
import { EditRoomComponent } from './edit-room/edit-room.component';
import { ListRoomComponent } from './list-room/list-room.component';
import { ViewRoomComponent } from './view-room/view-room.component';
import { RoomRoutingModule } from './room-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { StatusPipe } from 'src/app/core/pipes/status.pipe';
import { RoomOccupiedPipe } from 'src/app/core/pipes/roomOccupied.pipe';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
	declarations: [
		AddRoomComponent,
		EditRoomComponent,
		ListRoomComponent,
		ViewRoomComponent,
		RoomOccupiedPipe,
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		RoomRoutingModule,
		PaginationModule.forRoot(),
		NgSelectModule,
	],
})
export class RoomModule {}
