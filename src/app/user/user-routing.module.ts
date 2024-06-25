import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
	// { path: '', redirectTo: 'dashboard' },
	{
		path: '',
		component: HomeComponent,
	},
	{
		path: 'menu',
		component: MenuComponent,
	},
	
	
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class UserRoutingModule {}
