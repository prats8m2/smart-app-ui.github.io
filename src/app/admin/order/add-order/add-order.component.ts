import { Component, OnInit } from '@angular/core';
import { LAYOUT_VERTICAL } from 'src/app/layouts/layouts.model';
import { productList } from './products';
import { OrderService } from '../service/order.service';

@Component({
	selector: 'app-add-order',
	templateUrl: './add-order.component.html',
	styleUrls: ['./add-order.component.scss'],
})
export class AddOrderComponent implements OnInit {
	isCondensed = false;
	public products = [];

	categoryProductList: any[] = [];

	constructor(private orderService: OrderService) {
		document.body.setAttribute('data-bs-theme', 'dark');
	}

	onSettingsButtonClicked() {
		document.body.classList.toggle('right-bar-enabled');
	}

	/**
	 * On mobile toggle button clicked
	 */
	onToggleMobileMenu() {
		this.isCondensed = !this.isCondensed;
		document.body.classList.toggle('sidebar-enable');
		document.body.classList.toggle('vertical-collpsed');

		if (window.screen.width <= 768) {
			document.body.classList.remove('vertical-collpsed');
		}
	}

	ngOnInit(): void {
		let x: any = [];
		this.orderService.productsDetails.subscribe((res) => {
			this.categoryProductList = res;
		});
		console.log(this.categoryProductList);
		this.products = Object.assign([], productList);
	}
}
