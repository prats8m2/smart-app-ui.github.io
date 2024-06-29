import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { UserHeaderComponent } from './user-header/user-header.component';
import { MenuComponent } from './menu/menu.component';
import { UserOrderHistoryComponent } from './user-order-history/user-order-history.component';
import { CarouselComponent, CarouselModule } from 'ngx-bootstrap/carousel';
import { TipsComponent } from './tips/tips.component';
import { UserRoutingModule } from './user-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ProductComponent } from './product/product.component';
import { MenuFooterComponent } from './menu-footer/menu-footer.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { OrderComponent } from './order/order.component';
import { OrderTimelineComponent } from './order-timeline/order-timeline.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';



@NgModule({
	declarations: [
		HomeComponent,
		UserHeaderComponent,
		MenuComponent,
		UserOrderHistoryComponent,
		TipsComponent,
  ProductComponent,
  MenuFooterComponent,
  OrderSummaryComponent,
  OrderComponent,
  OrderTimelineComponent,
  OrderDetailsComponent,
	],
	imports: [
		CommonModule,
		CarouselModule,
		UserRoutingModule,
		NgSelectModule,
		SlickCarouselModule,
		AccordionModule.forRoot(),
	],
})
export class UserModule {}
