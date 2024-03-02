import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from './ui/ui.module';

import { WidgetModule } from './widget/widget.module';
import { StatusPipe } from '../core/pipes/status.pipe';
import { RoomOccupiedPipe } from '../core/pipes/roomOccupied.pipe';
import { SiteTypePipe } from '../core/pipes/siteType.pipe';
import { DefaultRolePipe } from '../core/pipes/defaultRole.pipe';
import { KeysPipe } from '../core/pipes/keys.pipe';
import { TopbarComponent } from '../layouts/topbar/topbar.component';
import { LayoutsModule } from '../layouts/layouts.module';

@NgModule({
	declarations: [
		StatusPipe,
		RoomOccupiedPipe,
		SiteTypePipe,
		DefaultRolePipe,
		KeysPipe,
	],
	imports: [CommonModule, UIModule, WidgetModule, LayoutsModule],
	exports: [
		StatusPipe,
		RoomOccupiedPipe,
		SiteTypePipe,
		DefaultRolePipe,
		KeysPipe,
	],
})
export class SharedModule {}
