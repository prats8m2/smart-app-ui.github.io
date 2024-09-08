import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListSessionComponent } from './list-session/list-session.component';

const routes: Routes = [
	{
		path: 'list-sessions',
		component: ListSessionComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SessionRoutingModule {}
