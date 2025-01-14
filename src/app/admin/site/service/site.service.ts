import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { SITE } from 'src/app/constants/api';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';

@Injectable({
	providedIn: 'root',
})
export class SiteService {
	constructor(private http: HttpClient, private globalService: GlobalService) {}

	listSites(params: IParams): Observable<any> {
		return this.http
			.get(
				SITE.LIST_SITE +
					`/${params.accountId}/${params.pageNumber}/${params.limit}`
			)
			.pipe(
				map((response: any) => {
					const result = JSON.parse(JSON.stringify(response));
					return result;
				})
			);
	}

	listSitesPromise(params: IParams) {
		return this.http
			.get(
				SITE.LIST_SITE +
					`/${params.accountId}/${params.pageNumber}/${params.limit}`
			)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	addSite(siteForm: FormGroup) {
		const {
			account,
			siteName,
			siteAddress,
			type,
			wifiDetails,
			country,
			state,
			mapLocation,
		} = siteForm.value;

		return this.http
			.post(SITE.ADD_SITE, {
				accountId: account,
				name: siteName,
				type: parseInt(type),
				address: siteAddress,
				wifiDetails: wifiDetails,
				country,
				state,
				mapLocation,
			})
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	viewSite(id: any) {
		return this.http
			.get(SITE.VIEW_SITE + id)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	updateSite(siteForm: any) {
		const { id, siteName, siteAddress, type, wifiDetails, mapLocation } =
			siteForm.value;

		return this.http
			.put(SITE.UPDATE_SITE, {
				id: id,
				name: siteName,
				type: parseInt(type),
				address: siteAddress,
				wifiDetails: wifiDetails,
				mapLocation: mapLocation?.length > 0 ? mapLocation : null,
			})
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	deleteSite(id: number) {
		return this.http
			.delete(SITE.DELETE_SITE + id.toString())
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	updateSiteSetting(siteId: number, key: string, value: number) {
		return this.http
			.put(SITE.UPDATE_SITE_SETTING, {
				id: siteId,
				key,
				value,
			})
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}
}
