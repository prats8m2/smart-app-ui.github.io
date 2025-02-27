import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { FEEDBACK, ORDER, SITE, USER } from 'src/app/constants/api';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';

@Injectable({
	providedIn: 'root',
})
export class HomeService {
	constructor(private http: HttpClient, private globalService: GlobalService) {}

	createOrder(siteId, roomId, tableId, type, description) {
		return this.http
			.post(ORDER.ADD_ORDER, {
				type,
				site: siteId,
				room: roomId,
				table: tableId,
				description,
			})
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	getAppOrders() {
		return this.http
			.get(ORDER.LIST_APP_ORDER)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	getSiteDetails(siteId) {
		return this.http
			.get(SITE.VIEW_SITE + siteId)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	addFeedback(feedback: any) {
		return this.http
			.post(FEEDBACK.ADD_FEEDBACK, feedback)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}
}
