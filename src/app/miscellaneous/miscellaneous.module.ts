import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { UIModule } from '../shared/ui/ui.module';
import { MiscellaneousRoutingModule } from './miscellaneous-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';

@NgModule({
	declarations: [PageNotFoundComponent, ServerErrorComponent, AccessDeniedComponent],
	imports: [
		CommonModule,
		CarouselModule,
		MiscellaneousRoutingModule,
		NgSelectModule,
		SlickCarouselModule,
		UIModule,
		FormsModule,
		AccordionModule.forRoot(),
		ReactiveFormsModule,
	],
})
export class MiscellaneousModule {}
