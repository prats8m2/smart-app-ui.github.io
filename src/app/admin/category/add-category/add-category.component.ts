import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

@Component({
	selector: 'app-add-category',
	templateUrl: './add-category.component.html',
	styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent implements OnInit {
	@ViewChild('startDateInput') startDateInput: ElementRef;
	isProduction = environment.production;
	public categoryForm: FormGroup;
	accountList: any = [];
	siteList: any = [];
	roomList: any = [];
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

	categoryTypes = [
		{ id: 1, label: 'Food' },
		{ id: 2, label: 'Amenities' },
	];
	time = { hour: 0, minute: 0 };
	meridian = true;

	scheduleControls: any = {
		startDate: [null],
		endDate: [null],
		sundayStartTime: [null],
		sundayEndTime: [null],
		mondayStartTime: [null],
		mondayEndTime: [null],
		tuesdayStartTime: [null],
		tuesdayEndTime: [null],
		wednesdayStartTime: [null],
		wednesdayEndTime: [null],
		thursdayStartTime: [null],
		thursdayEndTime: [null],
		fridayStartTime: [null],
		fridayEndTime: [null],
		saturdayStartTime: [null],
		saturdayEndTime: [null],
	};

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		public accountService: AccountService,
		private siteServices: SiteService,
		private config: NgbTimepickerConfig
	) {
		config.spinners = false;
		if (this.isProduction) {
			this.categoryForm = this.formBuilder.group({
				account: [null],
				site: [null, Validators.required],
				categoryName: ['', CATEGORY_NAME_VALIDATION],
				categoryDesc: [null, CATEGORY_DESC_VALIDATION],
				categorySeq: [1, Validators.required],
				type: [null, Validators.required],
				...this.scheduleControls,
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
				...this.scheduleControls,
			});
		}
	}

	ngOnInit(): void {
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
		this.router.navigateByUrl(URL_ROUTES.LIST_CATEGORY);
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
		console.log(this.categoryForm.value);
	}
}
