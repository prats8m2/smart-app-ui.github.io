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

	routeTo(page: string) {
		switch (page) {
			case 'MENU':
				{
					this.router.navigateByUrl(URL_ROUTES.MENU);
				}
				break;
			case 'ORDERS':
				{
					this.router.navigateByUrl(URL_ROUTES.ORDER_HISTORY);
				}
				break;
		}
	}
}
