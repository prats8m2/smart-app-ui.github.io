import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../services/menu.service';
import { GlobalService } from '../../core/services/global.service';

@Component({
	selector: 'app-order-summary',
	templateUrl: './order-summary.component.html',
	styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent {
	@Input() order: any;
	@Input() totalAmountOfProduct: number;
	siteId: any;
	roomId: any;
	tableId: any;
	orderDescription: string = 'test';
	categoryType: any = 1;
	constructor(
		private router: Router,
		private menuService: MenuService,
		private globalService: GlobalService
	) {
		document.body.setAttribute('data-bs-theme', 'dark');
	}

	ngOnInit() {
		this.siteId = this.globalService.getAppTokenInfo('SITE');
		this.roomId = this.globalService.getAppTokenInfo('ROOM');
		this.tableId = this.globalService.getAppTokenInfo('TABLE');
	}

	async addOrder() {
		const type = 2;

		const updatedProducts = this.order.map(
			({ price, name, total, ...rest }) => ({
				...rest,
			})
		);

		const newOrder = await this.menuService.createOrder(
			this.siteId,
			this.roomId,
			this.tableId,
			this.orderDescription,
			updatedProducts,
			type,
			this.categoryType
		);
	}
}
