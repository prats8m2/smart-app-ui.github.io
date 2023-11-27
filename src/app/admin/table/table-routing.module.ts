import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTableComponent } from './list-table/list-table.component';
import { AddTableComponent } from './add-table/add-table.component';
import { EditTableComponent } from './edit-table/edit-table.component';
import { ViewTableComponent } from './view-table/view-table.component';

const routes: Routes = [
	{
		path: 'list-tables',
		component: ListTableComponent,
	},
	{
		path: 'add-table',
		component: AddTableComponent,
	},
	{
		path: 'edit-table/:id',
		component: EditTableComponent,
	},
	{
		path: 'view-table/:id',
		component: ViewTableComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class TableRoutingModule {}
