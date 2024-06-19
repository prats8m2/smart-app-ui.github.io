import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListOrderComponent } from './list-order/list-order.component';
import { ViewOrderComponent } from './view-order/view-order.component';
import { AddOrderComponent } from './add-order/add-order.component';
import { KanbanComponent } from './kanban/kanban.component';

const routes: Routes = [
	{
		path: 'list-orders',
		component: ListOrderComponent,
	},
	{
		path: 'view-order/:id',
		component: ViewOrderComponent,
	},
	{
		path: 'add-order',
		component: AddOrderComponent,
	},
	{
		path: 'kanban',
		component: KanbanComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class OrderRoutingModule {}
