import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCategoryComponent } from './add-category/add-category.component';
import { ListCategoryComponent } from './list-category/list-category.component';
import { ViewCategoryComponent } from './view-category/view-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { CategoryRoutingModule } from './category-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
	declarations: [
		AddCategoryComponent,
		ListCategoryComponent,
		ViewCategoryComponent,
		EditCategoryComponent,
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		CategoryRoutingModule,
		PaginationModule.forRoot(),
		NgSelectModule,
	],
})
export class CategoryModule {}
