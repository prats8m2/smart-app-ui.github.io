import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { EVENT } from 'src/app/constants/api';
import { IParams } from 'src/app/core/interface/params';

@Injectable({
	providedIn: 'root',
})
export class EventService {
	constructor(private http: HttpClient) {}

	listEvents(params: IParams): Observable<any> {
		return this.http
			.get(
				EVENT.LIST_EVENT +
					`/${params.siteId}/${params.pageNumber}/${params.limit}`
			)
			.pipe(
				map((response: any) => {
					const result = JSON.parse(JSON.stringify(response));
					return result;
				})
			);
	}

	deleteEvent(id: number) {
		return this.http
			.delete(EVENT.DELETE_EVENT + id.toString())
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	viewEvent(id: any) {
		return this.http
			.get(EVENT.VIEW_EVENT + id)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}
}
