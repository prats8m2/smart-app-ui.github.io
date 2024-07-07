import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FeedbackRoutingModule } from './feedback-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import {
	NgbDatepickerModule,
	NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ListFeedbackComponent } from './list-feedback/list-feedback.component';
import { RatingModule } from 'ngx-bootstrap/rating';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

@NgModule({
	declarations: [ListFeedbackComponent],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		FeedbackRoutingModule,
		PaginationModule.forRoot(),
		NgSelectModule,
		SharedModule,
		RatingModule,
		NgbDatepickerModule,
		NgbTimepickerModule,
		ProgressbarModule,
	],
})
export class FeedbackModule {}
