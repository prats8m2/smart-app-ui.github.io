import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './dashboards/default/default.component';

const routes: Routes = [
	// { path: '', redirectTo: 'dashboard' },
	{
		path: '',
		component: DefaultComponent,
	},
	{ path: 'dashboard', component: DefaultComponent },
	{
		path: 'dashboards',
		loadChildren: () =>
			import('./dashboards/dashboards.module').then((m) => m.DashboardsModule),
	},
	{
		path: 'accounts',
		loadChildren: () =>
			import('./accounts/accounts.module').then((m) => m.AccountsModule),
	},
	{
		path: 'sites',
		loadChildren: () => import('./site/site.module').then((m) => m.SitesModule),
	},
	{
		path: 'staffs',
		loadChildren: () =>
			import('./staff/staff.module').then((m) => m.StaffModule),
	},
	{
		path: 'roles',
		loadChildren: () => import('./role/role.module').then((m) => m.RoleModule),
	},
	{
		path: 'devices',
		loadChildren: () =>
			import('./device/device.module').then((m) => m.DeviceModule),
	},
	{
		path: 'rooms',
		loadChildren: () => import('./room/room.module').then((m) => m.RoomModule),
	},
	{
		path: 'tables',
		loadChildren: () =>
			import('./table/table.module').then((m) => m.TableModule),
	},
	{
		path: 'events',
		loadChildren: () =>
			import('./events/events.module').then((m) => m.EventsModule),
	},
	{
		path: 'categories',
		loadChildren: () =>
			import('./category/category.module').then((m) => m.CategoryModule),
	},
	{
		path: 'products',
		loadChildren: () =>
			import('./product/product.module').then((m) => m.ProductModule),
	},
	{
		path: 'menu',
		loadChildren: () => import('./menu/menu.module').then((m) => m.MenuModule),
	},
	{
		path: 'orders',
		loadChildren: () =>
			import('./order/order.module').then((m) => m.OrderModule),
	},
	{
		path: 'feedback',
		loadChildren: () =>
			import('./feedback/feedback.module').then((m) => m.FeedbackModule),
	},

	{
		path: 'session',
		loadChildren: () =>
			import('./session/session.module').then((m) => m.SessionModule),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AdminRoutingModule {}
