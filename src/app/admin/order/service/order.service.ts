import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ORDER } from 'src/app/constants/api';
import { IParams } from 'src/app/core/interface/params';

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
	public ordersChange = new BehaviorSubject<any>(null);
	constructor(private http: HttpClient) {}

	listOrderPromise(params: IParams) {
		return this.http
			.get(
				ORDER.LIST_ORDER +
					`/${params.siteId}/${params.pageNumber}/${params.limit}`
			)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}
}
