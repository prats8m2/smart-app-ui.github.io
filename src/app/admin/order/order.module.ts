import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewOrderComponent } from './view-order/view-order.component';
import { ListOrderComponent } from './list-order/list-order.component';
import { OrderRoutingModule } from './order-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AddOrderComponent } from './add-order/add-order.component';
import { DndModule } from 'ngx-drag-drop';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { LayoutsModule } from 'src/app/layouts/layouts.module';
import { OrderSidebarComponent } from './order-sidebar/order-sidebar.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { OrderHeaderComponent } from './order-header/order-header.component';
import { KanbanComponent } from './kanban/kanban.component';
import { KanbanHeaderComponent } from './kanban-header/kanban-header.component';

@NgModule({
	declarations: [
		ViewOrderComponent,
		ListOrderComponent,
		AddOrderComponent,
		OrderSidebarComponent,
  OrderHeaderComponent,
  KanbanComponent,
  KanbanHeaderComponent,
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		OrderRoutingModule,
		PaginationModule.forRoot(),
		NgSelectModule,
		DndModule,
		CKEditorModule,
		LayoutsModule,
		SimplebarAngularModule,
	],
})
export class OrderModule {}
