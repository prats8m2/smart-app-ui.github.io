import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { PasswordresetComponent } from './auth/passwordreset/passwordreset.component';

const routes: Routes = [
	{ path: '', component: LoginComponent },
	{ path: 'reset-password', component: PasswordresetComponent },
	{
		path: 'auth',
		loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AccountRoutingModule {}
