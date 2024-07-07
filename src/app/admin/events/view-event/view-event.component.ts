import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { URL_ROUTES } from 'src/app/constants/routing';
import { GlobalService } from 'src/app/core/services/global.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../accounts/service/account.service';
import { EventService } from '../service/event.service';

@Component({
	selector: 'app-view-event',
	templateUrl: './view-event.component.html',
	styleUrls: ['./view-event.component.scss'],
})
export class ViewEventComponent implements OnInit {
	isProduction = environment.production;
	scheduleControls: any = {
		startDate: [null],
		endDate: [null],
		startTime: [null],
		endTime: [null],
		location: [null],
		geoLocation: [null],
	};
	public eventForm: FormGroup = this.formBuilder.group({
		account: [null],
		site: [null],
		eventName: [null],
		eventDesc: [null],
		type: [null],
		eventPrice: [null],
		scheduleData: this.formBuilder.group(this.scheduleControls),
	});
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showListCategory: boolean =
		this.globalService.checkForPermission('LIST-CATEGORY');

	today: Date = new Date();
	startMinDate: { year: number; month: number; day: number };
	endMinDate: { year: number; month: number; day: number };
	startDefaultTime: any = { hour: 0, minute: 0, second: 0 };
	endDefaultTime: any = { hour: 23, minute: 59, second: 6 };

	meridian = true;
	eventData: any;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		public accountService: AccountService,
		private config: NgbTimepickerConfig,
		private eventService: EventService,
		private activatedRoute: ActivatedRoute
	) {
		this.config.spinners = false;
	}

	ngOnInit(): void {
		this.getEvent();
		this.eventForm.disable();
	}

	getEvent() {
		this.activatedRoute.params.subscribe((params) => {
			let eventId = params['id'];
			this.eventService.viewEvent(eventId).then((res) => {
				if (res.status) {
					this.eventData = res.data;
					const type =
						this.eventData.inHouse == 1
							? 'In House'
							: this.eventData.inHouse == 2
							? 'Bash'
							: undefined;
					this.eventForm.patchValue({
						account: this.eventData.site.account.name,
						site: this.eventData.site.name,
						eventName: this.eventData.name,
						eventDesc: this.eventData.description || '-',
						eventPrice: this.eventData.entryFee,
						type: type,
					});
					this.patchScheduleData();
				}
			});
		});
	}

	patchScheduleData() {
		const scheduleData = this.eventForm.get('scheduleData');

		if (scheduleData) {
			scheduleData.patchValue({
				startDate: this.eventData.schedule.startDate,
				endDate: this.eventData.schedule.endDate,
			});
			const startTimeControl = `startTime`;
			const endTimeControl = `endTime`;

			scheduleData
				.get(startTimeControl)
				?.patchValue(
					this.convertTimeToJSON(this.eventData.schedule[startTimeControl])
				);

			scheduleData
				.get(endTimeControl)
				?.patchValue(
					this.convertTimeToJSON(this.eventData.schedule[endTimeControl])
				);

			scheduleData.patchValue({
				location: this.eventData.location,
				geoLocation: this.eventData.googleLocation,
			});
		}
	}

	routeToListEvent() {
		this.router.navigateByUrl(URL_ROUTES.LIST_EVENTS);
	}

	convertTimeToJSON(timeString: string) {
		let time = timeString.split(':');
		let timeObj = {
			hour: +time[0],
			minute: +time[1],
			second: +time[2],
		};
		return timeObj;
	}

	convertDateToJSON(dateObject: string) {
		let date = dateObject.split('-');
		let dateObj = {
			year: +date[0],
			month: +date[1],
			day: +date[2],
		};
		return dateObj;
	}

	routeToLocation() {
		const scheduleData = this.eventForm.get('scheduleData');
		const url = scheduleData.get('geoLocation').value;
		console.log(url);
		window.open(url, '_blank');
	}
}
