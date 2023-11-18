import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListRoomComponent } from './list-room/list-room.component';
import { AddRoomComponent } from './add-room/add-room.component';
import { EditRoomComponent } from './edit-room/edit-room.component';
import { ViewRoomComponent } from './view-room/view-room.component';

const routes: Routes = [
	{
		path: 'list-rooms',
		component: ListRoomComponent,
	},
	{
		path: 'add-room',
		component: AddRoomComponent,
	},
	{
		path: 'edit-room/:id',
		component: EditRoomComponent,
	},
	{
		path: 'view-room/:id',
		component: ViewRoomComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RoomRoutingModule {}
