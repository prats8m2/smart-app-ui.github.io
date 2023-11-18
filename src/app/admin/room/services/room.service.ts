import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ROOM } from 'src/app/constants/api';
import { IParams } from 'src/app/core/interface/params';

@Injectable({
	providedIn: 'root',
})
export class RoomService {
	constructor(private http: HttpClient) {}

	listRooms(params: IParams): Observable<any> {
		return this.http
			.get(
				ROOM.LIST_ROOM +
					`/${params.siteId}/${params.pageNumber}/${params.limit}`
			)
			.pipe(
				map((response: any) => {
					const result = JSON.parse(JSON.stringify(response));
					return result;
				})
			);
	}

	deleteRoom(id: number) {
		return this.http
			.delete(ROOM.DELETE_ROOM + id.toString())
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}
}
