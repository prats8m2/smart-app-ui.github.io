import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
}
