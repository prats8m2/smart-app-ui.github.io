import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from './ui/ui.module';

import { WidgetModule } from './widget/widget.module';
import { StatusPipe } from '../core/pipes/status.pipe';
import { RoomOccupiedPipe } from '../core/pipes/roomOccupied.pipe';
import { SiteTypePipe } from '../core/pipes/siteType.pipe';
import { DefaultRolePipe } from '../core/pipes/defaultRole.pipe';
import { KeysPipe } from '../core/pipes/keys.pipe';
import { LayoutsModule } from '../layouts/layouts.module';
import { TimeAgoPipe } from '../core/pipes/time-ago.pipe';
import { OrderStatusPipe } from '../core/pipes/order-status.pipe';
import { OrderTypePipe } from '../core/pipes/order-type.pipe';
import { EventTypePipe } from '../core/pipes/eventType.pipe';
import { PaymentTypePipe } from '../core/pipes/payment-type.pipe';

@NgModule({
	declarations: [
		StatusPipe,
		RoomOccupiedPipe,
		SiteTypePipe,
		DefaultRolePipe,
		TimeAgoPipe,
		KeysPipe,
		OrderStatusPipe,
		OrderTypePipe,
		EventTypePipe,
		PaymentTypePipe,
	],
	imports: [CommonModule, UIModule, WidgetModule, LayoutsModule],
	exports: [
		StatusPipe,
		RoomOccupiedPipe,
		SiteTypePipe,
		DefaultRolePipe,
		TimeAgoPipe,
		KeysPipe,
		OrderStatusPipe,
		OrderTypePipe,
		EventTypePipe,
		PaymentTypePipe,
	],
})
export class SharedModule {}
