import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Product {
	id: number;
	name: string;
	quantity: number;
}

@Injectable({
	providedIn: 'root',
})
export class OrderService {
	public productsDetails = new BehaviorSubject<any>(null);
	public productsChange = new BehaviorSubject<any>(null);
	public categoryChange = new BehaviorSubject<any>(false);
	constructor() {}
}
