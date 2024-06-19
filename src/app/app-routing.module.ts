import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout.component';
import { AddOrderComponent } from './admin/order/add-order/add-order.component';
import { KanbanComponent } from './admin/order/kanban/kanban.component';
const routes: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('./account/account.module').then((m) => m.AccountModule),
	},
	{
		path: 'admin',
		component: LayoutComponent,
		loadChildren: () =>
			import('./admin/admin.module').then((m) => m.AdminModule),
		canActivate: [AuthGuard],
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
	imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
