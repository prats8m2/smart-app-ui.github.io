import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
	@Input() product: any;
	@Input() addedProducts: any[];
	@Input() isAddedinOrder!: (productId: number) => boolean; // Accept the function as an input
	@Input() addProductToOrder!: (product: any, event: any) => any; // Accept the function as an input
	@Input() calculateQty!: (
		operation: string,
		productId: number,
		event: any
	) => any; // Accept the function as an input
}
