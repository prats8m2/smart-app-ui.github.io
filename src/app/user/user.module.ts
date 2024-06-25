import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { UserHeaderComponent } from './user-header/user-header.component';
import { MenuComponent } from './menu/menu.component';
import { SummaryComponent } from './summary/summary.component';
import { UserOrderHistoryComponent } from './user-order-history/user-order-history.component';
import { CarouselComponent, CarouselModule } from 'ngx-bootstrap/carousel';
import { TipsComponent } from './tips/tips.component';
import { UserRoutingModule } from './user-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ProductComponent } from './product/product.component';
import { MenuFooterComponent } from './menu-footer/menu-footer.component';



@NgModule({
	declarations: [
		HomeComponent,
		UserHeaderComponent,
		MenuComponent,
		SummaryComponent,
		UserOrderHistoryComponent,
		TipsComponent,
  ProductComponent,
  MenuFooterComponent,
	],
	imports: [
		CommonModule,
		CarouselModule,
		UserRoutingModule,
		NgSelectModule,
		AccordionModule.forRoot(),
	],
})
export class UserModule {}
