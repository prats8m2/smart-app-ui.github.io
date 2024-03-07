import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class OrderService {
	public productsDetails = new BehaviorSubject<any>(null);
	constructor() {}
}
