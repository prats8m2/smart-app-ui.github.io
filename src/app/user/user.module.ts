import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { UserHeaderComponent } from './user-header/user-header.component';
import { MenuComponent } from './menu/menu.component';
import { SummaryComponent } from './summary/summary.component';
import { UserOrderHistoryComponent } from './user-order-history/user-order-history.component';
import { CarouselComponent, CarouselModule } from 'ngx-bootstrap/carousel';
import { TipsComponent } from './tips/tips.component';



@NgModule({
  declarations: [
    HomeComponent,
    UserHeaderComponent,
    MenuComponent,
    SummaryComponent,
    UserOrderHistoryComponent,
    TipsComponent
  ],
  imports: [
    CommonModule,
    CarouselModule
  ]
})
export class UserModule { }
