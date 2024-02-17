import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MENU } from 'src/app/constants/api';
import { IParams } from 'src/app/core/interface/params';

@Injectable({
	providedIn: 'root',
})
export class MenuService {
	constructor(private http: HttpClient) {}

	listMenu(params: IParams): Observable<any> {
		return this.http
			.get(
				MENU.LIST_MENU +
					`/${params.siteId}/${params.pageNumber}/${params.limit}`
			)
			.pipe(
				map((response: any) => {
					const result = JSON.parse(JSON.stringify(response));
					return result;
				})
			);
	}

	deleteMenu(id: number) {
		return this.http
			.delete(MENU.DELETE_MENU + id.toString())
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	viewMenu(menuId: any) {
		return this.http
			.get(MENU.VIEW_MENU + menuId)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}
}
