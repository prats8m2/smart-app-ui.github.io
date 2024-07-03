import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListFeedbackComponent } from './list-feedback/list-feedback.component';

const routes: Routes = [
	{
		path: 'list-feedbacks',
		component: ListFeedbackComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class FeedbackRoutingModule {}
