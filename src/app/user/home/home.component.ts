import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	constructor(private router: Router) {
		document.body.setAttribute('data-bs-theme', 'dark');
	}

	routeToMenu() {
		console.log(URL_ROUTES.MENU);
		this.router.navigateByUrl(URL_ROUTES.MENU);
	}
}
