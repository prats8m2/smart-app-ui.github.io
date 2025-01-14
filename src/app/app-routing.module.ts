import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout.component';
import { AddOrderComponent } from './admin/order/add-order/add-order.component';
import { KanbanComponent } from './admin/order/kanban/kanban.component';
import { RedirectGuard } from './core/guards/redirect.guard';

const routes: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('./account/account.module').then((m) => m.AccountModule),
		canActivate: [RedirectGuard],
	},
	{
		path: 'admin',
		component: LayoutComponent,
		loadChildren: () =>
			import('./admin/admin.module').then((m) => m.AdminModule),
		canActivate: [AuthGuard],
	},
	{
		path: 'order/add',
		component: AddOrderComponent,
	},
	{
		path: 'order/kanban',
		component: KanbanComponent,
	},
	{
		path: 'app',
		loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
	},
	{
		path: 'attendant',
		loadChildren: () =>
			import('./attendant/attendant.module').then((m) => m.AttendantModule),
	},
	{
		path: 'error',
		loadChildren: () =>
			import('./miscellaneous/miscellaneous.module').then(
				(m) => m.MiscellaneousModule
			),
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
