import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSiteComponent } from './add-site/add-site.component';
import { EditSiteComponent } from './edit-site/edit-site.component';
import { ListSitesComponent } from './list-sites/list-sites.component';
import { ViewSiteComponent } from './view-site/view-site.component';
import { SitesRoutingModule } from './site-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
	declarations: [
		AddSiteComponent,
		EditSiteComponent,
		ListSitesComponent,
		ViewSiteComponent,
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		SitesRoutingModule,
		PaginationModule.forRoot(),
	],
})
export class SitesModule {}
