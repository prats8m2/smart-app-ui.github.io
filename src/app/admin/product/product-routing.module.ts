import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListProductComponent } from './list-product/list-product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ViewProductComponent } from './view-product/view-product.component';

const routes: Routes = [
	{
		path: 'list-products',
		component: ListProductComponent,
	},
	{
		path: 'add-product',
		component: AddProductComponent,
	},
	{
		path: 'edit-product/:id',
		component: EditProductComponent,
	},
	{
		path: 'view-product/:id',
		component: ViewProductComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ProductRoutingModule {}
