import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListMenuComponent } from './list-menu/list-menu.component';
import { AddMenuComponent } from './add-menu/add-menu.component';
import { EditMenuComponent } from './edit-menu/edit-menu.component';
import { ViewMenuComponent } from './view-menu/view-menu.component';

const routes: Routes = [
	{
		path: 'list-menus',
		component: ListMenuComponent,
	},
	{
		path: 'add-menu',
		component: AddMenuComponent,
	},
	{
		path: 'edit-menu/:id',
		component: EditMenuComponent,
	},
	{
		path: 'view-menu/:id',
		component: ViewMenuComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MenuRoutingModule {}
