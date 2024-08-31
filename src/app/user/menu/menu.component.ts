import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { MenuService } from '../services/menu.service';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
	// bread crumb items
	breadCrumbItems: Array<{}>;

	// Collapse declare
	isCollapsed: boolean = false;
	public firstColleaps: boolean = false;
	public secondColleaps: boolean = false;
	public bothColleaps: boolean = false;
	public order = [];
	isFirstOpen: boolean = false;
	totalAmountOfProduct: number = 0;
	addedProducts: { [key: number]: number } = {}; // Stores product ID and quantity

	menuData: any;

	constructor(private router: Router, private menuService: MenuService) {
		document.body.setAttribute('data-bs-theme', 'dark');
	}

	async ngOnInit() {
		const res = await this.menuService.getAppMenu();
		if (res.status) {
			this.menuData = res.data;
			console.log(this.menuData);
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
		}
	}

	addProductToOrder(product) {
		this.addedProducts[product.id] = 1; // Add product with initial quantity 1

		const existingProduct = this.order.find((item) => item.id === product.id);
		if (!existingProduct) {
			const productOrder = {
				id: product.id,
				quantity: 1,
				price: product.price,
				name: product.name,
				total: product.price,
			};
			this.order.push(productOrder);
			this.totalAmountOfProduct += product.price;
		} else {
		}
	}

	isAddedinOrder(id) {
		return this.order.find((item) => item.id === id);
	}

	calculateQty(operation: string, productId: number): void {
		const index = this.order.findIndex(
			(orderItem) => orderItem.id === productId
		);

		if (operation === '1') {
			this.addedProducts[productId] += 1;
			this.totalAmountOfProduct += this.order[index].price;
		} else if (operation === '0' && this.addedProducts[productId] > 1) {
			this.addedProducts[productId] -= 1;
			this.totalAmountOfProduct -= this.order[index].price;
		} else if (operation === '0' && this.addedProducts[productId] === 1) {
			// If quantity is 1 and user clicks "-", remove the product from the order
			this.totalAmountOfProduct -= this.order[index].price;
			this.order.splice(index, 1); // Remove product from the order
			delete this.addedProducts[productId]; // Remove product from addedProducts
		}

		if (this.addedProducts[productId]) {
			this.order[index].quantity = this.addedProducts[productId];
			this.order[index].total =
				this.addedProducts[productId] * this.order[index].price;
		}
	}

	delete(index): void {
		if (index !== -1) {
			this.order.splice(index, 1);
		}
	}
}
