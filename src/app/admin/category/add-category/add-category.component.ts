import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import {
	CATEGORY_DESC_VALIDATION,
	CATEGORY_NAME_VALIDATION,
} from 'src/app/constants/validations';
import {
	hasError,
	isValid,
	isTouchedAndValid,
	isTouched,
} from 'src/app/core/helpers/form-error';
import { errorMessages } from 'src/app/core/helpers/form-error-message';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../accounts/service/account.service';
import { SiteService } from '../../site/service/site.service';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../service/category.service';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
	selector: 'app-add-category',
	templateUrl: './add-category.component.html',
	styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent implements OnInit {
	isProduction = environment.production;
	public categoryForm: FormGroup;
	accountList: any = [];
	siteList: any = [];
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showListCategory: boolean =
		this.globalService.checkForPermission('LIST-CATEGORY');
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
	categoryTypes = [
		{ id: 1, label: 'Food' },
		{ id: 2, label: 'Amenities' },
	];

	meridian = true;

	scheduleControls: any = {
		startDate: [null, Validators.required],
		endDate: [null, Validators.required],
		sunday_startTime: [this.startDefaultTime],
		sunday_endTime: [this.endDefaultTime],
		monday_startTime: [this.startDefaultTime],
		monday_endTime: [this.endDefaultTime],
		tuesday_startTime: [this.startDefaultTime],
		tuesday_endTime: [this.endDefaultTime],
		wednesday_startTime: [this.startDefaultTime],
		wednesday_endTime: [this.endDefaultTime],
		thursday_startTime: [this.startDefaultTime],
		thursday_endTime: [this.endDefaultTime],
		friday_startTime: [this.startDefaultTime],
		friday_endTime: [this.endDefaultTime],
		saturday_startTime: [this.startDefaultTime],
		saturday_endTime: [this.endDefaultTime],
	};

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		public accountService: AccountService,
		private siteServices: SiteService,
		private config: NgbTimepickerConfig,
		private categoryService: CategoryService,
		private dialogService: DialogService
	) {
		this.config.spinners = false;
		this.startMinDate = {
			year: this.today.getFullYear(),
			month: this.today.getMonth() + 1,
			day: this.today.getDate(),
		};
		if (this.isProduction) {
			this.categoryForm = this.formBuilder.group({
				account: [null],
				site: [null, Validators.required],
				categoryName: ['', CATEGORY_NAME_VALIDATION],
				categoryDesc: [null, CATEGORY_DESC_VALIDATION],
				categorySeq: [1, Validators.required],
				type: [null, Validators.required],
				scheduleData: this.formBuilder.group(this.scheduleControls),
			});
		} else {
			const randomNumber = Math.floor(1000 + Math.random() * 9000);
			this.categoryForm = this.formBuilder.group({
				account: [null],
				site: [null, Validators.required],
				categoryName: ['CT_' + randomNumber, CATEGORY_NAME_VALIDATION],
				categoryDesc: [null, CATEGORY_DESC_VALIDATION],
				categorySeq: [1, Validators.required],
				type: [null, Validators.required],
				scheduleData: this.formBuilder.group(this.scheduleControls),
			});
		}
	}

	ngOnInit(): void {
		let fg = this.categoryForm.get('scheduleData') as FormGroup;
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
	}
	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.siteList = [...res.data.sites];
			}
		});
	}

	routeToListCategory() {
		if (!this.categoryForm.dirty) {
			this.router.navigateByUrl(URL_ROUTES.LIST_CATEGORY);
		} else {
			this.dialogService.openBackConfirmDialog().then((result) => {
				if (result.value) {
					this.router.navigateByUrl(URL_ROUTES.LIST_CATEGORY);
				}
			});
		}
	}

	//form validation function
	isError(formControlName: string, errorType: string): boolean {
		return hasError(this.categoryForm, formControlName, errorType);
	}

	showError(formControlName: string): boolean {
		return isValid(this.categoryForm, formControlName);
	}

	showSuccess(formControlName: string): boolean {
		return isTouchedAndValid(this.categoryForm, formControlName);
	}

	formTouched(formControlName: string): boolean {
		return isTouched(this.categoryForm, formControlName);
	}

	errorMessage(formControlName: string, errorType: string): string {
		return errorMessages[formControlName][errorType];
	}

	changeAccountData(accountId: any) {
		this.siteParams.accountId = accountId;
		this.categoryForm.get('account').patchValue(accountId);
		this.listSiteAPI(this.siteParams);
	}

	changeSiteData(siteId: any) {
		const randomNumber = Math.floor(1000 + Math.random() * 9000);
		this.categoryForm
			.get('categoryName')
			.patchValue(`CT_${siteId}_${randomNumber}`);
	}

	addCategory() {
		const scheduleData = this.categoryForm.get('scheduleData');
		if (scheduleData) {
			const daysOfWeek = [
				'sunday',
				'monday',
				'tuesday',
				'wednesday',
				'thursday',
				'friday',
				'saturday',
			];
			daysOfWeek.forEach((day) => {
				scheduleData
					.get(`${day}_startTime`)
					?.patchValue(
						this.convertTimeObjectToString(
							scheduleData.get(`${day}_startTime`).value
						)
					);
				scheduleData
					.get(`${day}_endTime`)
					?.patchValue(
						this.convertTimeObjectToString(
							scheduleData.get(`${day}_endTime`).value
						)
					);
			});
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
		console.log(this.categoryForm.value);
		this.categoryService.addCategory(this.categoryForm).then((res) => {
			if (res.status) {
				this.router.navigate([URL_ROUTES.LIST_CATEGORY]);
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
		let fg = this.categoryForm.get('scheduleData') as FormGroup;
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
