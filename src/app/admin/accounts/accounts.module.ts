import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAccountsComponent } from './list-accounts/list-accounts.component';
import { AccountsRoutingModule } from './accounts-routing.module';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { ViewAccountComponent } from './view-account/view-account.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusPipe } from 'src/app/core/pipes/status.pipe';

@NgModule({
	declarations: [
		ListAccountsComponent,
		EditAccountComponent,
		AddAccountComponent,
		ViewAccountComponent,
		StatusPipe,
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		AccountsRoutingModule,
		PaginationModule.forRoot(),
	],
})
export class AccountsModule {}
