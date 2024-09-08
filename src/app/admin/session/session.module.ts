import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionRoutingModule } from './session-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListSessionComponent } from './list-session/list-session.component';

@NgModule({
	declarations: [ListSessionComponent],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		SessionRoutingModule,
		PaginationModule.forRoot(),
		NgSelectModule,
		SharedModule,
	],
})
export class SessionModule {}
