import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEventComponent } from './list-event/list-event.component';
import { AddEventComponent } from './add-event/add-event.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { ViewEventComponent } from './view-event/view-event.component';

const routes: Routes = [
	{
		path: 'list-events',
		component: ListEventComponent,
	},
	{
		path: 'add-event',
		component: AddEventComponent,
	},
	{
		path: 'edit-event/:id',
		component: EditEventComponent,
	},
	{
		path: 'view-event/:id',
		component: ViewEventComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class EventRoutingModule {}
