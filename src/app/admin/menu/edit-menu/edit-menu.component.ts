import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { URL_ROUTES } from 'src/app/constants/routing';
import {
	MENU_DESC_VALIDATION,
	MENU_NAME_VALIDATION,
} from 'src/app/constants/validations';
import {
	hasError,
	isTouched,
	isTouchedAndValid,
	isValid,
} from 'src/app/core/helpers/form-error';
import { errorMessages } from 'src/app/core/helpers/form-error-message';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../accounts/service/account.service';
import { CategoryService } from '../../category/service/category.service';
import { MenuService } from '../service/menu.service';

@Component({
	selector: 'app-edit-menu',
	templateUrl: './edit-menu.component.html',
	styleUrls: ['./edit-menu.component.scss'],
})
export class EditMenuComponent implements OnInit {
	isProduction = environment.production;
	public menuForm: FormGroup;
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

	categoryParams: IParams = {
		siteId: null,
		limit: 100,
		pageNumber: 1,
	};

	selectedSiteId!: number;
	menuData: any;

	today: Date = new Date();
	startMinDate: { year: number; month: number; day: number };
	endMinDate: { year: number; month: number; day: number };
	defaultTime: any = { hour: 0, minute: 0, second: 0 };
	menuTypes = [
		{ id: 1, label: 'Food' },
		{ id: 2, label: 'Amenities' },
	];

	meridian = true;
	categoriesList: any = [];
	categoryProductDropdownList: any[] = [];

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
		private menuService: MenuService,
		private categortService: CategoryService
	) {
		this.config.spinners = false;
		this.startMinDate = {
			year: this.today.getFullYear(),
			month: this.today.getMonth() + 1,
			day: this.today.getDate(),
		};
		if (this.isProduction) {
			this.menuForm = this.formBuilder.group({
				id: [null],
				account: [null],
				site: [null, Validators.required],
				menuName: ['', MENU_NAME_VALIDATION],
				menuDesc: [null, MENU_DESC_VALIDATION],
				type: [null, Validators.required],
				scheduleData: this.formBuilder.group(this.scheduleControls),
				status: [null],
				menuItemsData: [Validators.required],
			});
		} else {
			const randomNumber = Math.floor(1000 + Math.random() * 9000);
			this.menuForm = this.formBuilder.group({
				id: [null],
				account: [null],
				site: [null],
				menuName: ['CT_' + randomNumber, MENU_NAME_VALIDATION],
				menuDesc: [null, MENU_DESC_VALIDATION],
				type: [null, Validators.required],
				scheduleData: this.formBuilder.group(this.scheduleControls),
				status: [null],
				menuItemsData: [Validators.required],
			});
		}
	}

	ngOnInit(): void {
		this.getCategory();
	}

	routeToListCategory() {
		this.router.navigateByUrl(URL_ROUTES.LIST_MENU);
	}

	//form validation function
	isError(formControlName: string, errorType: string): boolean {
		return hasError(this.menuForm, formControlName, errorType);
	}

	showError(formControlName: string): boolean {
		return isValid(this.menuForm, formControlName);
	}

	showSuccess(formControlName: string): boolean {
		return isTouchedAndValid(this.menuForm, formControlName);
	}

	formTouched(formControlName: string): boolean {
		return isTouched(this.menuForm, formControlName);
	}

	errorMessage(formControlName: string, errorType: string): string {
		return errorMessages[formControlName][errorType];
	}

	listCategoryAPI(params: IParams) {
		this.categortService.listCategory(params).subscribe((res) => {
			if (res.status) {
				this.categoriesList = [...res.data.categories];
				if (this.categoriesList.length) {
					this.categoryProductDropdownList = this.categoriesList.flatMap(
						(category) =>
							category.products.map((product) => ({
								category: category.id,
								menuName: category.name,
								product: product.id,
								productName: product.name,
							}))
					);
				}
			}
			console.log(this.categoryProductDropdownList);
		});
	}

	updateCategory() {
		const scheduleData = this.menuForm.get('scheduleData');
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

		console.log(this.menuForm.getRawValue());

		//call update menu API
		this.menuService
			.updateMenu(this.menuForm, this.selectedSiteId)
			.then((res) => {
				if (res.status) {
					this.router.navigate([URL_ROUTES.LIST_MENU]);
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
		let fg = this.menuForm.get('scheduleData') as FormGroup;
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
			let menuId = params['id'];
			this.menuService.viewMenu(menuId).then((res) => {
				if (res.status) {
					this.menuData = res.data;
					const type = this.menuData.type;
					this.menuForm.patchValue({
						id: menuId,
						account: this.menuData.site.account.name,
						site: this.menuData.site.name,
						menuName: this.menuData.name,
						menuDesc: this.menuData.description,
						type: type,
						status: this.menuData.status,
						menuItemsData: this.menuData.menuItems,
					});
					this.selectedSiteId = this.menuData.site.id;
					this.menuForm.get('account').disable();
					this.menuForm.get('site').disable();
					this.categoryParams.siteId = '' + this.selectedSiteId;
					this.listCategoryAPI(this.categoryParams);
					this.patchScheduleData();
				}
			});
		});
	}

	patchScheduleData() {
		const scheduleData = this.menuForm.get('scheduleData');

		if (scheduleData) {
			scheduleData.patchValue({
				startDate: this.convertDateToJSON(this.menuData.schedule.startDate),
				endDate: this.convertDateToJSON(this.menuData.schedule.endDate),
			});

			this.endMinDate = this.convertDateToJSON(
				this.menuData.schedule.startDate
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
						this.convertTimeToJSON(this.menuData.schedule[startTimeControl])
					);

				scheduleData
					.get(endTimeControl)
					?.patchValue(
						this.convertTimeToJSON(this.menuData.schedule[endTimeControl])
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

	toggle(control): void {
		const statusControl = this.menuForm.get(`${control}`) as FormControl;
		statusControl.setValue(!statusControl.value);
	}
}
