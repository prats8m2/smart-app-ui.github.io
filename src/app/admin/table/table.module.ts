import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTableComponent } from './add-table/add-table.component';
import { EditTableComponent } from './edit-table/edit-table.component';
import { ListTableComponent } from './list-table/list-table.component';
import { ViewTableComponent } from './view-table/view-table.component';
import { TableRoutingModule } from './table-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
	declarations: [
		AddTableComponent,
		EditTableComponent,
		ListTableComponent,
		ViewTableComponent,
	],
	imports: [
		CommonModule,
		TableRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		PaginationModule.forRoot(),
		NgSelectModule,
	],
})
export class TableModule {}
