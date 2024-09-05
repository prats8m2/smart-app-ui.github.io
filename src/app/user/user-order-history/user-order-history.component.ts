import { Component } from '@angular/core';
import { Router, RouterConfigOptions } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { HomeService } from '../services/home.service';

@Component({
	selector: 'app-user-order-history',
	templateUrl: './user-order-history.component.html',
	styleUrls: ['./user-order-history.component.scss'],
})
export class UserOrderHistoryComponent {
	orders: any;
	constructor(private router: Router, private homeService: HomeService) {
		document.body.setAttribute('data-bs-theme', 'dark');
	}

	async ngOnInit() {
		const res = await this.homeService.getAppOrders();
		if (res.status) {
			console.log(res.data);
			this.orders = res?.data?.orders;
		} else {
			return null;
		}
	}

	routeTo(page: string) {
		switch (page) {
			case 'HOME':
				{
					this.router.navigateByUrl(URL_ROUTES.HOME);
				}
				break;
			case 'ORDER_DETAILS':
				{
					this.router.navigateByUrl(URL_ROUTES.ORDER_DETAILS);
				}
				break;
		}
	}
}
