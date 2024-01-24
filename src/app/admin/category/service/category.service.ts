import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { CATEGORY, DEVICE } from 'src/app/constants/api';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';

@Injectable({
	providedIn: 'root',
})
export class CategoryService {
	constructor(private http: HttpClient) {}

	listCategory(params: IParams): Observable<any> {
		return this.http
			.get(
				CATEGORY.LIST_CATEGORY +
					`/${params.siteId}/${params.pageNumber}/${params.limit}`
			)
			.pipe(
				map((response: any) => {
					const result = JSON.parse(JSON.stringify(response));
					return result;
				})
			);
	}

	listAvailableDevice(params: IParams): Observable<any> {
		return this.http
			.get(DEVICE.LIST_AVAILABLE_DEVICE + `/${params.siteId}`)
			.pipe(
				map((response: any) => {
					const result = JSON.parse(JSON.stringify(response));
					return result;
				})
			);
	}

	addCategory(categoryForm: FormGroup) {
		const {
			account,
			site,
			categoryName,
			categoryDesc,
			categorySeq,
			type,
			scheduleData,
		} = categoryForm.getRawValue();

		return this.http
			.post(CATEGORY.ADD_CATEGORY, {
				name: categoryName,
				description: categoryDesc,
				type: type,
				sequence: categorySeq,
				scheduleData: scheduleData,
				site: site,
				account: account,
			})
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	viewCategory(categoryId: any) {
		return this.http
			.get(CATEGORY.VIEW_CATEGORY + categoryId)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	updateCategory(categoryForm: any, siteId: any) {
		const { id, categoryName, categoryDesc, categorySeq, type, scheduleData } =
			categoryForm.value;

		return this.http
			.put(CATEGORY.UPDATE_CATEGORY, {
				id: id,
				name: categoryName,
				type: type,
				sequence: categorySeq,
				scheduleData: scheduleData,
				description: categoryDesc,
				site: siteId,
			})
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	deleteCategory(id: number) {
		return this.http
			.delete(CATEGORY.DELETE_CATEGORY + id.toString())
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}
}
