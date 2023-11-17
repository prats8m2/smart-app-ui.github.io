import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ROLE, SITE } from 'src/app/constants/api';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';

@Injectable({
	providedIn: 'root',
})
export class RoleService {
	constructor(private http: HttpClient, private globalService: GlobalService) {}

	listRoles(params: IParams): Observable<any> {
		return this.http
			.get(
				ROLE.LIST_ROLE +
					`/${params.accountId}/${params.pageNumber}/${params.limit}`
			)
			.pipe(
				map((response: any) => {
					const result = JSON.parse(JSON.stringify(response));
					return result;
				})
			);
	}
}
