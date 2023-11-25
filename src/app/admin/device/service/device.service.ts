import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { DEVICE, ROLE, SITE } from 'src/app/constants/api';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';

@Injectable({
	providedIn: 'root',
})
export class DeviceService {
	constructor(private http: HttpClient, private globalService: GlobalService) {}

	listDevice(params: IParams): Observable<any> {
		return this.http
			.get(
				DEVICE.LIST_DEVICE +
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
		const { account, site, room, deviceName, status } = deviceForm.value;

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

	deleteDevice(id: number) {
		return this.http
			.delete(DEVICE.DELETE_DEVICE + id.toString())
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}
}
