import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListSitesComponent } from './list-sites/list-sites.component';
import { AddSiteComponent } from './add-site/add-site.component';
import { EditSiteComponent } from './edit-site/edit-site.component';
import { ViewSiteComponent } from './view-site/view-site.component';

const routes: Routes = [
	{
		path: 'list-sites',
		component: ListSitesComponent,
	},
	{
		path: 'add-site',
		component: AddSiteComponent,
	},
	{
		path: 'edit-site/:id',
		component: EditSiteComponent,
	},
	{
		path: 'view-site/:id',
		component: ViewSiteComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SitesRoutingModule {}
