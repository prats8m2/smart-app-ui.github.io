import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SITE } from 'src/app/constants/api';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';

@Injectable({
	providedIn: 'root',
})
export class SiteService {
	constructor(private http: HttpClient, private globalService: GlobalService) {}

	listSites(params: IParams) {
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
}
