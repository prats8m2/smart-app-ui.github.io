// redirect.guard.ts
import { Injectable } from '@angular/core';
import {
	CanActivate,
	Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/account/auth/login/services/login.service';

@Injectable({ providedIn: 'root' })
export class RedirectGuard implements CanActivate {
	constructor(private router: Router, private authService: LoginService) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		if (this.authService.isLoggedIn()) {
			this.router.navigateByUrl('/admin');
			return false;
		}
		return true;
	}
}
