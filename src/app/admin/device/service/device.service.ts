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

	addRole(roleForm: FormGroup) {
		const { account, roleName, permissions } = roleForm.value;

		return this.http
			.post(ROLE.ADD_ROLE, {
				accountId: account,
				name: roleName,
				permissions: permissions,
			})
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	viewRole(roleId: any) {
		return this.http
			.get(ROLE.VIEW_ROLE + roleId)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	updateSite(userForm: any) {
		const { id, siteName, siteAddress, type, wifiDetails } = userForm.value;

		return this.http
			.put(SITE.UPDATE_SITE, {
				id: id,
				name: siteName,
				type: parseInt(type),
				address: siteAddress,
				wifiDetails: wifiDetails,
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
