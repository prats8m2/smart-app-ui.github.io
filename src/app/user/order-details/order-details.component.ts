import { Component } from '@angular/core';
import { Router, RouterConfigOptions } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';

@Component({
	selector: 'app-order-details',
	templateUrl: './order-details.component.html',
	styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent {
	constructor(private router: Router) {
		document.body.setAttribute('data-bs-theme', 'dark');
	}
	routeTo(page: string) {
		switch (page) {
			case 'HOME':
				{
					this.router.navigateByUrl(URL_ROUTES.HOME);
				}
				break;
		}
	}
}
