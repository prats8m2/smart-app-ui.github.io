import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListCategoryComponent } from './list-category/list-category.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { ViewCategoryComponent } from './view-category/view-category.component';

const routes: Routes = [
	{
		path: 'list-categories',
		component: ListCategoryComponent,
	},
	{
		path: 'add-category',
		component: AddCategoryComponent,
	},
	{
		path: 'edit-category/:id',
		component: EditCategoryComponent,
	},
	{
		path: 'view-category/:id',
		component: ViewCategoryComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CategoryRoutingModule {}
