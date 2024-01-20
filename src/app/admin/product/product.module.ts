import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from './add-product/add-product.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { ListProductComponent } from './list-product/list-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductRoutingModule } from './product-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	declarations: [
		AddProductComponent,
		ViewProductComponent,
		ListProductComponent,
		EditProductComponent,
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		ProductRoutingModule,
		PaginationModule.forRoot(),
		NgSelectModule,
		SharedModule,
	],
})
export class ProductModule {}
