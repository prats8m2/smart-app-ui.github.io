import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { PRODUCT } from 'src/app/constants/api';
import { IParams } from 'src/app/core/interface/params';

@Injectable({
	providedIn: 'root',
})
export class ProductService {
	constructor(private http: HttpClient) {}

	listProduct(params: IParams): Observable<any> {
		return this.http
			.get(
				PRODUCT.LIST_PRODUCT +
					`/${params.siteId}/${params.pageNumber}/${params.limit}`
			)
			.pipe(
				map((response: any) => {
					const result = JSON.parse(JSON.stringify(response));
					return result;
				})
			);
	}

	deleteProduct(id: number) {
		return this.http
			.delete(PRODUCT.DELETE_PRODUCT + id.toString())
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	addProduct(categoryForm: FormGroup) {
		const {
			account,
			site,
			productName,
			productDesc,
			categories,
			isSpecial,
			type,
			status,
			isNew,
			productPrice,
		} = categoryForm.getRawValue();

		return this.http
			.post(PRODUCT.ADD_PRODUCT, {
				accountId: account,
				name: productName,
				description: productDesc,
				isNew: isNew ? 1 : 0,
				isSpecial: isSpecial ? 1 : 0,
				status: status ? 1 : 0,
				price: productPrice,
				categories: categories,
				site: site,
				type: type,
			})
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	viewProduct(productId: any) {
		return this.http
			.get(PRODUCT.VIEW_PRODUCT + productId)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}
}
