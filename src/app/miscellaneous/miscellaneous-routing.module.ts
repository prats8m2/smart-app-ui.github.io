import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';

const routes: Routes = [
	{
		path: '404',
		component: PageNotFoundComponent,
	},
	{
		path: '403',
		component: AccessDeniedComponent,
	},
	{
		path: '500',
		component: ServerErrorComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MiscellaneousRoutingModule {}
