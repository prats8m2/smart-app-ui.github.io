import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { URL_ROUTES } from 'src/app/constants/routing';
import { GlobalService } from 'src/app/core/services/global.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../accounts/service/account.service';
import { EventService } from '../service/event.service';
import {
	CATEGORY_NAME_VALIDATION,
	CATEGORY_DESC_VALIDATION,
} from 'src/app/constants/validations';
import {
	hasError,
	isValid,
	isTouchedAndValid,
	isTouched,
} from 'src/app/core/helpers/form-error';
import { errorMessages } from 'src/app/core/helpers/form-error-message';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
	selector: 'app-edit-event',
	templateUrl: './edit-event.component.html',
	styleUrls: ['./edit-event.component.scss'],
})
export class EditEventComponent implements OnInit {
	isProduction = environment.production;
	startDefaultTime: any = { hour: 0, minute: 0, second: 0 };
	endDefaultTime: any = { hour: 23, minute: 59, second: 6 };
	eventTypes = [
		{ id: 1, label: 'In House' },
		{ id: 2, label: 'Bash' },
	];
	public eventForm: FormGroup;
	selectedSiteId!: number;
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showListEvent: boolean = this.globalService.checkForPermission('LIST-EVENT');

	today: Date = new Date();
	startMinDate: { year: number; month: number; day: number };
	endMinDate: { year: number; month: number; day: number };
	defaultTime: any = { hour: 0, minute: 0, second: 0 };
	scheduleControls: any = {
		startDate: [null, Validators.required],
		endDate: [null, Validators.required],
		startTime: [this.defaultTime, Validators.required],
		endTime: [this.defaultTime, Validators.required],
		location: [null, Validators.required],
		geoLocation: [null, Validators.required],
	};

	meridian = true;
	eventData: any;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		public accountService: AccountService,
		private config: NgbTimepickerConfig,
		private eventService: EventService,
		private activatedRoute: ActivatedRoute,
		private dialogService: DialogService
	) {
		this.config.spinners = false;
		if (this.isProduction) {
			this.eventForm = this.formBuilder.group({
				id: [null],
				account: [null],
				site: [null, Validators.required],
				eventName: ['', CATEGORY_NAME_VALIDATION],
				eventDesc: [null, CATEGORY_DESC_VALIDATION],
				type: [null, Validators.required],
				eventPrice: [null, Validators.required],
				scheduleData: this.formBuilder.group(this.scheduleControls),
			});
		} else {
			const randomNumber = Math.floor(1000 + Math.random() * 9000);
			this.eventForm = this.formBuilder.group({
				id: [null],
				account: [null],
				site: [null, Validators.required],
				eventName: ['EVNT_' + randomNumber, CATEGORY_NAME_VALIDATION],
				eventDesc: [null, CATEGORY_DESC_VALIDATION],
				type: [null, Validators.required],
				eventPrice: [null, Validators.required],
				scheduleData: this.formBuilder.group(this.scheduleControls),
			});
		}
		this.startMinDate = {
			year: this.today.getFullYear(),
			month: this.today.getMonth() + 1,
			day: this.today.getDate(),
		};
	}

	ngOnInit(): void {
		this.getEvent();
	}

	getEvent() {
		this.activatedRoute.params.subscribe((params) => {
			let eventId = params['id'];
			this.eventService.viewEvent(eventId).then((res) => {
				if (res.status) {
					this.eventData = res.data;
					const type = this.eventData.inHouse;
					this.eventForm.patchValue({
						id: eventId,
						account: this.eventData.site.account.name,
						site: this.eventData.site.name,
						eventName: this.eventData.name,
						eventDesc: this.eventData.description || '-',
						eventPrice: this.eventData.entryFee,
						type: type,
					});
					this.selectedSiteId = this.eventData.site.id;
					this.eventForm.get('account').disable();
					this.eventForm.get('site').disable();
					this.patchScheduleData();
				}
			});
		});
	}

	isError(formControlName: string, errorType: string): boolean {
		return hasError(this.eventForm, formControlName, errorType);
	}

	showError(formControlName: string): boolean {
		return isValid(this.eventForm, formControlName);
	}

	showSuccess(formControlName: string): boolean {
		return isTouchedAndValid(this.eventForm, formControlName);
	}

	formTouched(formControlName: string): boolean {
		return isTouched(this.eventForm, formControlName);
	}

	errorMessage(formControlName: string, errorType: string): string {
		return errorMessages[formControlName][errorType];
	}

	patchScheduleData() {
		const scheduleData = this.eventForm.get('scheduleData');

		if (scheduleData) {
			scheduleData.patchValue({
				startDate: this.convertDateToJSON(this.eventData.schedule.startDate),
				endDate: this.convertDateToJSON(this.eventData.schedule.endDate),
			});

			this.endMinDate = this.convertDateToJSON(
				this.eventData.schedule.startDate
			);
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
		if (!this.eventForm.dirty) {
			this.router.navigateByUrl(URL_ROUTES.LIST_EVENTS);
		} else {
			this.dialogService.openBackConfirmDialog().then((result) => {
				if (result.value) {
					this.router.navigateByUrl(URL_ROUTES.LIST_EVENTS);
				}
			});
		}
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

	convertTimeToJSON(timeString: string) {
		let time = timeString.split(':');
		let timeObj = {
			hour: +time[0],
			minute: +time[1],
			second: +time[2],
		};
		return timeObj;
	}

	convertTimeObjectToString(timeObject: {
		hour: number;
		minute: number;
		second: number;
	}) {
		return `${timeObject.hour}:${timeObject.minute}:${timeObject.second}`;
	}

	convertDateObjectToString(dateObject: {
		year: number;
		month: number;
		day: number;
	}) {
		return `${dateObject.year}-${dateObject.month}-${dateObject.day}`;
	}

	startDateSellected(event: any) {
		this.endMinDate = {
			year: event.year,
			month: event.month,
			day: event.day,
		};
		let fg = this.eventForm.get('scheduleData') as FormGroup;
		fg.get('endDate').patchValue({ year: null, month: null, day: null });
		fg.get('endDate').enable();
	}

	updateEvent() {
		const scheduleData = this.eventForm.get('scheduleData');
		if (scheduleData) {
			scheduleData
				.get(`startTime`)
				?.patchValue(
					this.convertTimeObjectToString(scheduleData.get(`startTime`).value)
				);

			scheduleData
				.get(`endTime`)
				?.patchValue(
					this.convertTimeObjectToString(scheduleData.get(`endTime`).value)
				);

			scheduleData
				.get('startDate')
				.patchValue(
					this.convertDateObjectToString(scheduleData.get('startDate').value)
				);
			scheduleData
				.get('endDate')
				.patchValue(
					this.convertDateObjectToString(scheduleData.get('endDate').value)
				);
		}

		//call add catgory API
		this.eventService
			.updateEvent(this.eventForm, this.selectedSiteId)
			.then((res) => {
				if (res.status) {
					this.router.navigate([URL_ROUTES.LIST_EVENTS]);
				} else {
					console.log('ERROR');
				}
			});
	}
}
