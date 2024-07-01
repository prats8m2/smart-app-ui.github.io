import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { LoaderComponent } from './loader/loader.component';
import { ProductComponent } from './product/product.component';
import { OrderComponent } from './order/order.component';
import { TipsComponent } from './tips/tips.component';
@NgModule({
	declarations: [
		PagetitleComponent,
		LoaderComponent,
		ProductComponent,
		OrderComponent,
		TipsComponent,
	],
	imports: [CommonModule, FormsModule],
	exports: [
		PagetitleComponent,
		LoaderComponent,
		ProductComponent,
		OrderComponent,
		TipsComponent,
	],
})
export class UIModule {}
