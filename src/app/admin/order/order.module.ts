import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewOrderComponent } from './view-order/view-order.component';
import { ListOrderComponent } from './list-order/list-order.component';
import { OrderRoutingModule } from './order-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
	declarations: [ViewOrderComponent, ListOrderComponent],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		OrderRoutingModule,
		PaginationModule.forRoot(),
		NgSelectModule,
	],
})
export class OrderModule {}
