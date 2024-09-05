import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { UserOrderHistoryComponent } from './user-order-history/user-order-history.component';
import { OrderDetailsComponent } from './order-details/order-details.component';

const routes: Routes = [
	// { path: '', redirectTo: 'dashboard' },
	{
		path: '',
		component: HomeComponent,
	},
	{
		path: 'menu/:type',
		component: MenuComponent,
	},
	{
		path: 'orders',
		component: UserOrderHistoryComponent,
	},
	{
		path: 'order',
		component: OrderDetailsComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class UserRoutingModule {}
