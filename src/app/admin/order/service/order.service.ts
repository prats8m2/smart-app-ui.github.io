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
					`/${params.siteId}/${params.type}/${params.pageNumber}/${params.limit}`
			)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	updateOrderStatus(id: number, status: number) {
		return this.http
			.put(ORDER.UPDATE_ORDER_STATUS, {
				id,
				status,
			})
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	addOrder(
		type: any = 1,
		categoryType: number,
		table: any,
		room: any,
		site: any,
		products: any
	) {
		let obj: any = {
			type: type,
			site: site,
			products: products,
			categoryType,
		};

		if (table != 0) {
			obj.table = table;
		}
		if (room != 0) {
			obj.room = room;
		}
		return this.http
			.post(ORDER.ADD_ORDER, obj)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	viewOrder(id: any) {
		return this.http
			.get(ORDER.VIEW_ORDER + id)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	listAssignUsersList(params: any) {
		return this.http
			.get(
				ORDER.ASSIGN_USER_LISR +
					`/${params.siteId}/${params.pageNumber}/${params.limit}`
			)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}
}
