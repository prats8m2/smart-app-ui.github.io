import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { URL_ROUTES } from 'src/app/constants/routing';
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
import { IParams } from 'src/app/core/interface/params';
import { DialogService } from 'src/app/core/services/dialog.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../accounts/service/account.service';
import { SiteService } from '../../site/service/site.service';
import { EventService } from '../service/event.service';

@Component({
	selector: 'app-add-event',
	templateUrl: './add-event.component.html',
	styleUrls: ['./add-event.component.scss'],
})
export class AddEventComponent implements OnInit {
	isProduction = environment.production;
	public eventForm: FormGroup;
	accountList: any = [];
	siteList: any = [];
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showListEvent: boolean = this.globalService.checkForPermission('LIST-EVENT');
	accountParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};

	siteParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};

	today: Date = new Date();
	startMinDate: { year: number; month: number; day: number };
	endMinDate: { year: number; month: number; day: number };
	startDefaultTime: any = { hour: 0, minute: 0, second: 0 };
	endDefaultTime: any = { hour: 23, minute: 59, second: 6 };
	defaultTime: any = { hour: 0, minute: 0, second: 0 };
	eventTypes = [
		{ id: 1, label: 'In House' },
		{ id: 2, label: 'Bash' },
	];

	meridian = true;

	scheduleControls: any = {
		startDate: [null, Validators.required],
		endDate: [null, Validators.required],
		startTime: [this.defaultTime, Validators.required],
		endTime: [this.defaultTime, Validators.required],
		location: [null, Validators.required],
		geoLocation: [null, Validators.required],
	};

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		public accountService: AccountService,
		private siteServices: SiteService,
		private config: NgbTimepickerConfig,
		private dialogService: DialogService,
		private eventService: EventService
	) {
		this.config.spinners = false;
		this.startMinDate = {
			year: this.today.getFullYear(),
			month: this.today.getMonth() + 1,
			day: this.today.getDate(),
		};
		if (this.isProduction) {
			this.eventForm = this.formBuilder.group({
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
				account: [null],
				site: [null, Validators.required],
				eventName: ['EVNT_' + randomNumber, CATEGORY_NAME_VALIDATION],
				eventDesc: [null, CATEGORY_DESC_VALIDATION],
				type: [null, Validators.required],
				eventPrice: [null, Validators.required],
				scheduleData: this.formBuilder.group(this.scheduleControls),
			});
		}
	}

	ngOnInit(): void {
		let fg = this.eventForm.get('scheduleData') as FormGroup;
		fg.get('endDate').disable();
		if (this.showListAccount) {
			this.accountService.listUser(this.accountParams).subscribe((res) => {
				if (res.status) {
					this.accountList = [...res.data.users];
					if (this.accountList.length) {
						this.siteParams.accountId = this.accountList[0].account.id;
						this.listSiteAPI(this.siteParams);
					}
				}
			});
		} else {
			this.listSiteAPI(this.siteParams);
		}
		this.globalService.formControlValuesChanged(this.eventForm);
	}
	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.siteList = [...res.data.sites];
			}
		});
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

	//form validation function
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

	changeAccountData(accountId: any) {
		this.siteParams.accountId = accountId;
		this.eventForm.get('account').patchValue(accountId);
		this.listSiteAPI(this.siteParams);
	}

	changeSiteData(siteId: any) {
		const randomNumber = Math.floor(1000 + Math.random() * 9000);
		this.eventForm.get('eventName').patchValue(`CT_${siteId}_${randomNumber}`);
	}

	addEvent() {
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
		this.eventService.addEvent(this.eventForm).then((res) => {
			if (res.status) {
				this.router.navigate([URL_ROUTES.LIST_EVENTS]);
			} else {
				console.log('ERROR');
			}
		});
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
}
