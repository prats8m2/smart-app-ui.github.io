import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { UIModule } from '../shared/ui/ui.module';
import { HomeComponent } from './home/home.component';
import { MenuFooterComponent } from './menu-footer/menu-footer.component';
import { MenuComponent } from './menu/menu.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { OrderTimelineComponent } from './order-timeline/order-timeline.component';
import { TipsComponent } from '../shared/ui/tips/tips.component';
import { UserHeaderComponent } from './user-header/user-header.component';
import { UserOrderHistoryComponent } from './user-order-history/user-order-history.component';
import { UserRoutingModule } from './user-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [
		HomeComponent,
		UserHeaderComponent,
		MenuComponent,
		UserOrderHistoryComponent,
		MenuFooterComponent,
		OrderSummaryComponent,
		OrderTimelineComponent,
		OrderDetailsComponent,
	],
	imports: [
		CommonModule,
		CarouselModule,
		UserRoutingModule,
		NgSelectModule,
		SlickCarouselModule,
		UIModule,
		FormsModule,
		AccordionModule.forRoot(),
	],
})
export class UserModule {}
