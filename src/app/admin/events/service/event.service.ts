import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
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

	addEvent(eventForm: FormGroup) {
		const { site, eventName, eventDesc, type, eventPrice, scheduleData } =
			eventForm.getRawValue();

		const config = {
			name: eventName,
			description: eventDesc,
			inHouse: type,
			location: scheduleData.location,
			googleLocation: scheduleData.geoLocation,
			entryFee: eventPrice,
			site,
			startDate: scheduleData.startDate,
			endDate: scheduleData.endDate,
			startTime: scheduleData.startTime,
			endTime: scheduleData.endTime,
		};

		return this.http
			.post(EVENT.ADD_EVENT, config)
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

	updateEvent(eventForm: FormGroup, siteId: any) {
		const { id, eventName, eventDesc, type, eventPrice, scheduleData } =
			eventForm.getRawValue();

		const config = {
			id,
			name: eventName,
			description: eventDesc,
			inHouse: type,
			location: scheduleData.location,
			googleLocation: scheduleData.geoLocation,
			entryFee: eventPrice,
			site: siteId,
			startDate: scheduleData.startDate,
			endDate: scheduleData.endDate,
			startTime: scheduleData.startTime,
			endTime: scheduleData.endTime,
		};

		return this.http
			.put(EVENT.UPDATE_EVENT, config)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}
}
