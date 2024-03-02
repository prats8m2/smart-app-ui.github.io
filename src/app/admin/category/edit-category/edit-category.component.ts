import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { GlobalService } from 'src/app/core/services/global.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../accounts/service/account.service';
import { CategoryService } from '../service/category.service';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
	selector: 'app-edit-category',
	templateUrl: './edit-category.component.html',
	styleUrls: ['./edit-category.component.scss'],
})
export class EditCategoryComponent implements OnInit {
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

	selectedSiteId!: number;

	categoryData: any;

	today: Date = new Date();
	startMinDate: { year: number; month: number; day: number };
	endMinDate: { year: number; month: number; day: number };
	defaultTime: any = { hour: 0, minute: 0, second: 0 };
	categoryTypes = [
		{ id: 1, label: 'Food' },
		{ id: 2, label: 'Amenities' },
	];

	meridian = true;

	scheduleControls: any = {
		startDate: [null, Validators.required],
		endDate: [null, Validators.required],
		sunday_startTime: [this.defaultTime],
		sunday_endTime: [this.defaultTime],
		monday_startTime: [this.defaultTime],
		monday_endTime: [this.defaultTime],
		tuesday_startTime: [this.defaultTime],
		tuesday_endTime: [this.defaultTime],
		wednesday_startTime: [this.defaultTime],
		wednesday_endTime: [this.defaultTime],
		thursday_startTime: [this.defaultTime],
		thursday_endTime: [this.defaultTime],
		friday_startTime: [this.defaultTime],
		friday_endTime: [this.defaultTime],
		saturday_startTime: [this.defaultTime],
		saturday_endTime: [this.defaultTime],
	};

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		public accountService: AccountService,
		private config: NgbTimepickerConfig,
		private categoryService: CategoryService,
		private activatedRoute: ActivatedRoute,
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
				id: [null],
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
				id: [null],
				account: [null],
				site: [null],
				categoryName: ['CT_' + randomNumber, CATEGORY_NAME_VALIDATION],
				categoryDesc: [null, CATEGORY_DESC_VALIDATION],
				categorySeq: [null, Validators.required],
				type: [null, Validators.required],
				scheduleData: this.formBuilder.group(this.scheduleControls),
			});
		}
	}

	ngOnInit(): void {
		this.getCategory();
	}

	routeToListCategory() {
		if (!this.categoryForm.dirty) {
			this.router.navigateByUrl(URL_ROUTES.LIST_CATEGORY);
		} else {
			this.dialogService.openBackConfirmDialog().then((result) => {
				if (result.value) {
					this.router.navigateByUrl(URL_ROUTES.LIST_TABLE);
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

	updateCategory() {
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
						this.convertTimeToString(scheduleData.get(`${day}_startTime`).value)
					);
				scheduleData
					.get(`${day}_endTime`)
					?.patchValue(
						this.convertTimeToString(scheduleData.get(`${day}_endTime`).value)
					);
			});
			scheduleData
				.get('startDate')
				.patchValue(
					this.convertDateToString(scheduleData.get('startDate').value)
				);
			scheduleData
				.get('endDate')
				.patchValue(
					this.convertDateToString(scheduleData.get('endDate').value)
				);
		}

		//call update catgory API
		this.categoryService
			.updateCategory(this.categoryForm, this.selectedSiteId)
			.then((res) => {
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

	getCategory() {
		this.activatedRoute.params.subscribe((params) => {
			let categoryId = params['id'];
			this.categoryService.viewCategory(categoryId).then((res) => {
				if (res.status) {
					this.categoryData = res.data;
					const type = this.categoryData.type;
					this.categoryForm.patchValue({
						id: categoryId,
						account: this.categoryData.site.account.name,
						site: this.categoryData.site.name,
						categoryName: this.categoryData.name,
						categoryDesc: this.categoryData.description,
						categorySeq: this.categoryData.sequence,
						type: type,
					});
					this.selectedSiteId = this.categoryData.site.id;
					this.categoryForm.get('account').disable();
					this.categoryForm.get('site').disable();
					this.patchScheduleData();
				}
			});
		});
	}

	patchScheduleData() {
		const scheduleData = this.categoryForm.get('scheduleData');

		if (scheduleData) {
			scheduleData.patchValue({
				startDate: this.convertDateToJSON(this.categoryData.schedule.startDate),
				endDate: this.convertDateToJSON(this.categoryData.schedule.endDate),
			});

			this.endMinDate = this.convertDateToJSON(
				this.categoryData.schedule.startDate
			);
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
				const startTimeControl = `${day}_startTime`;
				const endTimeControl = `${day}_endTime`;

				scheduleData
					.get(startTimeControl)
					?.patchValue(
						this.convertTimeToJSON(this.categoryData.schedule[startTimeControl])
					);

				scheduleData
					.get(endTimeControl)
					?.patchValue(
						this.convertTimeToJSON(this.categoryData.schedule[endTimeControl])
					);
			});
		}
	}

	convertTimeToString(timeObject: {
		hour: number;
		minute: number;
		second: number;
	}) {
		return `${timeObject.hour}:${timeObject.minute}:${timeObject.second}`;
	}

	convertDateToString(dateObject: {
		year: number;
		month: number;
		day: number;
	}) {
		return `${dateObject.year}-${dateObject.month}-${dateObject.day}`;
	}
}
