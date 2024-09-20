import { Component } from '@angular/core';
import { OrderService } from '../../admin/order/service/order.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	orders: any;

	constructor(private orderService: OrderService) {
		document.body.setAttribute('data-bs-theme', 'dark');
	}

	async ngOnInit(): Promise<void> {
		this.orderService.listOrderOfAttendant().then((res) => {
			this.orders = res.data?.inProgressOrders;
		});

		const orders = await this.orderService.listOrderOfAttendant();
		this.orders = orders.data?.inProgressOrders;
	}
}
