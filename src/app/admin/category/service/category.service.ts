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

	addDevice(deviceForm: FormGroup) {
		const { account, site, room, deviceName, status } =
			deviceForm.getRawValue();

		return this.http
			.post(DEVICE.ADD_DEVICE, {
				accountId: account,
				code: deviceName,
				roomId: room,
				siteId: site,
				status: status ? 1 : 0,
			})
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	viewDevice(deviceId: any) {
		return this.http
			.get(DEVICE.VIEW_DEVICE + deviceId)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	updateDevice(deviceForm: any) {
		const { id, room, deviceName, status } = deviceForm.value;

		return this.http
			.put(DEVICE.UPDATE_DEVICE, {
				id: id,
				code: deviceName,
				roomId: room,
				status: status ? 1 : 0,
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
