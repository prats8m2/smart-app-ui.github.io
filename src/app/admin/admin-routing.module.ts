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
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AdminRoutingModule {}
