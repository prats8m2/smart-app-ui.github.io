import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { FEEDBACK, MENU } from 'src/app/constants/api';
import { IParams } from 'src/app/core/interface/params';

@Injectable({
	providedIn: 'root',
})
export class FeedbackService {
	constructor(private http: HttpClient) {}

	listFeedback(params: IParams): Observable<any> {
		return this.http
			.get(
				FEEDBACK.LIST_FEEDBACK +
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

	addMenu(menuForm: FormGroup) {
		const {
			account,
			site,
			menuName,
			menuDesc,
			type,
			scheduleData,
			menuItemsData,
		} = menuForm.getRawValue();

		return this.http
			.post(MENU.ADD_MENU, {
				name: menuName,
				description: menuDesc,
				type: type,
				scheduleData: scheduleData,
				site: site,
				account: account,
				menuItemsData: menuItemsData,
			})
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	updateMenu(menuForm: any, siteId: any) {
		const {
			id,
			menuName,
			menuDesc,
			type,
			scheduleData,
			menuItemsData,
			status,
		} = menuForm.value;

		return this.http
			.put(MENU.UPDATE_MENU, {
				id: id,
				name: menuName,
				type: type,
				scheduleData: scheduleData,
				description: menuDesc,
				site: siteId,
				menuItemsData: menuItemsData,
				status: status ? 1 : 0,
			})
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}
}