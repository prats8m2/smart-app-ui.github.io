import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { SITE, TABLE } from 'src/app/constants/api';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';

@Injectable({
	providedIn: 'root',
})
export class TableService {
	constructor(private http: HttpClient, private globalService: GlobalService) {}

	listTable(params: IParams): Observable<any> {
		return this.http
			.get(
				TABLE.LIST_TABLE +
					`/${params.siteId}/${params.pageNumber}/${params.limit}`
			)
			.pipe(
				map((response: any) => {
					const result = JSON.parse(JSON.stringify(response));
					return result;
				})
			);
	}

	addTable(tableForm: FormGroup) {
		const { account, site, device, tableName } = tableForm.value;

		return this.http
			.post(TABLE.ADD_TABLE, {
				accountId: account,
				name: tableName,
				siteId: site,
				deviceId: device,
			})
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	viewTable(id: any) {
		return this.http
			.get(TABLE.VIEW_TABLE + id)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	updateTable(tableForm: any, site: any) {
		const { id, device, status, tableName, occupied } = tableForm.getRawValue();

		return this.http
			.put(TABLE.UPDATE_TABLE, {
				id: id,
				name: tableName,
				siteId: site,
				deviceId: device,
				status: status ? 1 : 0,
				occupied: occupied ? 1 : 0,
			})
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	deleteTable(id: number) {
		return this.http
			.delete(TABLE.DELETE_TABLE + id.toString())
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}
}
