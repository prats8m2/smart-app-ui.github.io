import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { ROOM, SESSION } from 'src/app/constants/api';
import { IParams } from 'src/app/core/interface/params';

@Injectable({
	providedIn: 'root',
})
export class SessionService {
	constructor(private http: HttpClient) {}

	listSessions(params: IParams): Observable<any> {
		return this.http
			.get(
				SESSION.LIST_SESSION +
					`/${params.siteId}/${params.type}/${params.pageNumber}/${params.limit}`
			)
			.pipe(
				map((response: any) => {
					const result = JSON.parse(JSON.stringify(response));
					return result;
				})
			);
	}

	terminateSession(id: number) {
		return this.http
			.put(SESSION.TERMINATE_SESSION, {
				id,
			})
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}
}
