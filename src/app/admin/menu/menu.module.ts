import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMenuComponent } from './add-menu/add-menu.component';
import { EditMenuComponent } from './edit-menu/edit-menu.component';
import { ListMenuComponent } from './list-menu/list-menu.component';
import { ViewMenuComponent } from './view-menu/view-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MenuRoutingModule } from './menu-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import {
	NgbDatepickerModule,
	NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TreeSelectModule } from 'primeng/treeselect';

@NgModule({
	declarations: [
		AddMenuComponent,
		EditMenuComponent,
		ListMenuComponent,
		ViewMenuComponent,
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		MenuRoutingModule,
		PaginationModule.forRoot(),
		NgSelectModule,
		SharedModule,
		NgbDatepickerModule,
		NgbTimepickerModule,
		TreeSelectModule,
	],
})
export class MenuModule {}
