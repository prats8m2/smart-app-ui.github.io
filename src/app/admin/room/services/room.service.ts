import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
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

	addRoom(roomForm: FormGroup) {
		const { account, site, wifi, status, roomName, device } = roomForm.value;

		return this.http
			.post(ROOM.ADD_ROOM, {
				accountId: account,
				name: roomName,
				wifi: wifi,
				siteId: site,
				deviceId: device,
				status: status ? 1 : 0,
			})
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	viewRoom(id: any) {
		return this.http
			.get(ROOM.VIEW_ROOM + id)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}
}
