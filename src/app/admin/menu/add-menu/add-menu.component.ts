import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { URL_ROUTES } from 'src/app/constants/routing';
import {
	CATEGORY_DESC_VALIDATION,
	CATEGORY_NAME_VALIDATION,
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
import { SiteService } from '../../site/service/site.service';
import { CategoryService } from '../../category/service/category.service';
import { MenuService } from '../service/menu.service';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
	selector: 'app-add-menu',
	templateUrl: './add-menu.component.html',
	styleUrls: ['./add-menu.component.scss'],
})
export class AddMenuComponent implements OnInit {
	isProduction = environment.production;
	public menuForm: FormGroup;
	accountList: any = [];
	siteList: any = [];
	categoriesList: any = [];
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showListMenu: boolean = this.globalService.checkForPermission('LIST-MENU');
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
		type: 1,
		limit: 100,
		pageNumber: 1,
	};

	today: Date = new Date();
	startMinDate: { year: number; month: number; day: number };
	endMinDate: { year: number; month: number; day: number };
	startDefaultTime: any = { hour: 0, minute: 0, second: 0 };
	endDefaultTime: any = { hour: 23, minute: 59, second: 6 };
	menuTypes = [
		{ id: 1, label: 'Food' },
		{ id: 2, label: 'Amenities' },
	];

	categoryProductDropdownList: any[] = [];

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
		private categortService: CategoryService,
		private menuService: MenuService,
		private dialogService: DialogService
	) {
		this.config.spinners = false;
		this.startMinDate = {
			year: this.today.getFullYear(),
			month: this.today.getMonth() + 1,
			day: this.today.getDate(),
		};
		if (this.isProduction) {
			this.menuForm = this.formBuilder.group({
				account: [null],
				site: [null, Validators.required],
				menuName: ['', MENU_NAME_VALIDATION],
				menuDesc: [null, MENU_DESC_VALIDATION],
				type: [null, Validators.required],
				scheduleData: this.formBuilder.group(this.scheduleControls),
				menuItemsData: [Validators.required],
				status: [true],
			});
		} else {
			const randomNumber = Math.floor(1000 + Math.random() * 9000);
			this.menuForm = this.formBuilder.group({
				account: [null],
				site: [null, Validators.required],
				menuName: ['MN_' + randomNumber, CATEGORY_NAME_VALIDATION],
				menuDesc: [null, CATEGORY_DESC_VALIDATION],
				type: [null, Validators.required],
				scheduleData: this.formBuilder.group(this.scheduleControls),
				menuItemsData: [null, Validators.required],
				status: [true],
			});
		}
	}

	ngOnInit(): void {
		this.menuForm.get('status').disable();
		let fg = this.menuForm.get('scheduleData') as FormGroup;
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

		this.globalService.formControlValuesChanged(this.menuForm);
	}
	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.siteList = [...res.data.sites];
				if (this.siteList.length) {
					this.categoryParams.siteId = this.siteList[0].id;
					this.listCategoryAPI(this.categoryParams);
				}
			}
		});
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
								categoryName: category.name,
								product: product.id,
								productName: product.name,
							}))
					);
				}
			}
		});
	}

	routeToListMenu() {
		if (!this.menuForm.dirty) {
			this.router.navigateByUrl(URL_ROUTES.LIST_MENU);
		} else {
			this.dialogService.openBackConfirmDialog().then((result) => {
				if (result.value) {
					this.router.navigateByUrl(URL_ROUTES.LIST_MENU);
					this.globalService.enableSideNavRouting();
				}
			});
		}
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

	changeAccountData(accountId: any) {
		if (accountId) {
			this.siteParams.accountId = accountId;
			this.menuForm.get('account').patchValue(accountId);
			this.clearProductListData();
			this.listSiteAPI(this.siteParams);
		}
	}

	changeSiteData(siteId: any) {
		if (siteId) {
			this.categoryParams.siteId = siteId;
			this.clearProductListData();
			this.listCategoryAPI(this.categoryParams);
		}
	}

	clearProductListData() {
		this.categoryProductDropdownList = [];
		this.menuForm.get('menuItemsData').patchValue([]);
	}

	addMenu() {
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
		this.menuService.addMenu(this.menuForm).then((res) => {
			if (res.status) {
				this.router.navigate([URL_ROUTES.LIST_MENU]);
				this.globalService.enableSideNavRouting();
			} else {
				console.log('ERROR');
			}
		});
	}

	changeCategoryType(typeId: number) {
		if (typeId) {
			this.categoryParams.type = typeId;
			this.listCategoryAPI(this.categoryParams);
		}
	}

	startDateSellected(event: any) {
		this.endMinDate = {
			year: event.year,
			month: event.month,
			day: event.day,
		};
		let fg = this.menuForm.get('scheduleData') as FormGroup;
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

	toggle(): void {
		const statusControl = this.menuForm.get('status') as FormControl;
		statusControl.setValue(!statusControl.value);
	}
}
