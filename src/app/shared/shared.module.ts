import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from './ui/ui.module';

import { WidgetModule } from './widget/widget.module';
import { StatusPipe } from '../core/pipes/status.pipe';
import { RoomOccupiedPipe } from '../core/pipes/roomOccupied.pipe';
import { SiteTypePipe } from '../core/pipes/siteType.pipe';
import { DefaultRolePipe } from '../core/pipes/defaultRole.pipe';
import { KeysPipe } from '../core/pipes/keys.pipe';

@NgModule({
	declarations: [
		StatusPipe,
		RoomOccupiedPipe,
		SiteTypePipe,
		DefaultRolePipe,
		KeysPipe,
	],
	imports: [CommonModule, UIModule, WidgetModule],
	exports: [
		StatusPipe,
		RoomOccupiedPipe,
		SiteTypePipe,
		DefaultRolePipe,
		KeysPipe,
	],
})
export class SharedModule {}
