import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { UserOrderHistoryComponent } from './user-order-history/user-order-history.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { EventsComponent } from './events/events.component';
import { FeedbackComponent } from './feedback/feedback.component';

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
	{
		path: 'feedback',
		component: FeedbackComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class UserRoutingModule {}
