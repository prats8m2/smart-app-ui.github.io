import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import {
	PASSWORD_VALIDATION,
	SITE_ACCOUNT_VALIDATION,
	SITE_ADDRESS_VALIDATION,
	SITE_NAME_VALIDATION,
	USER_NAME_VALIDATION,
} from 'src/app/constants/validations';
import {
	hasError,
	isTouched,
	isTouchedAndValid,
	isValid,
} from 'src/app/core/helpers/form-error';
import { errorMessages } from 'src/app/core/helpers/form-error-message';
import { GlobalService } from 'src/app/core/services/global.service';
import { SiteService } from '../service/site.service';
import { AccountService } from '../../accounts/service/account.service';
import { IParams } from 'src/app/core/interface/params';
import { environment } from 'src/environments/environment';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
	selector: 'app-add-site',
	templateUrl: './add-site.component.html',
	styleUrls: ['./add-site.component.scss'],
})
export class AddSiteComponent {
	isProduction = environment.production;
	public siteForm: FormGroup;
	accountList: any = [];
	siteTypes = [
		{ id: 1, label: 'Hotel' },
		{ id: 2, label: 'Restaurant' },
	];

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		private siteService: SiteService,
		public accountService: AccountService,
		private dialogService: DialogService
	) {
		if (this.isProduction) {
			this.siteForm = this.formBuilder.group({
				account: [null],
				siteName: ['', SITE_NAME_VALIDATION],
				siteAddress: ['', SITE_ADDRESS_VALIDATION],
				type: [undefined, SITE_ACCOUNT_VALIDATION],
				wifiDetails: new FormArray([]),
			});
		} else {
			const randomNumber = Math.floor(1000 + Math.random() * 9000);
			this.siteForm = this.formBuilder.group({
				account: [null],
				siteName: ['Site-' + randomNumber, SITE_NAME_VALIDATION],
				siteAddress: ['Address-' + randomNumber, SITE_ADDRESS_VALIDATION],
				type: [undefined, SITE_ACCOUNT_VALIDATION],
				wifiDetails: new FormArray([]),
			});
		}
	}

	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');

	accountParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};

	siteParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};

	ngOnInit() {
		if (this.showListAccount) {
			this.siteForm.controls['account'].addValidators(SITE_ACCOUNT_VALIDATION);
			this.accountService.listUser(this.accountParams).subscribe((res) => {
				if (res.status) {
					this.accountList = [...res.data.users];
				}
			});
		}
	}
	//form validation function
	isError(formControlName: string, errorType: string): boolean {
		return hasError(this.siteForm, formControlName, errorType);
	}

	showError(formControlName: string): boolean {
		return isValid(this.siteForm, formControlName);
	}

	showSuccess(formControlName: string): boolean {
		return isTouchedAndValid(this.siteForm, formControlName);
	}

	formTouched(formControlName: string): boolean {
		return isTouched(this.siteForm, formControlName);
	}

	errorMessage(formControlName: string, errorType: string): string {
		return errorMessages[formControlName][errorType];
	}

	public addSite() {
		//call add site API
		this.siteService.addSite(this.siteForm).then((res) => {
			if (res.status) {
				this.router.navigate([URL_ROUTES.LIST_SITE]);
			} else {
				console.log('error');
			}
		});
	}

	field(): FormGroup {
		return this.formBuilder.group({
			username: ['', USER_NAME_VALIDATION],
			password: ['', PASSWORD_VALIDATION],
		});
	}

	routeToListSite() {
		if (!this.siteForm.dirty) {
			this.router.navigateByUrl(URL_ROUTES.LIST_SITE);
		} else {
			this.dialogService.openBackConfirmDialog().then((result) => {
				if (result.value) {
					this.router.navigateByUrl(URL_ROUTES.LIST_SITE);
				}
			});
		}
	}

	get formData(): FormArray {
		return this.siteForm.get('wifiDetails') as FormArray;
	}

	removeField(i: number) {
		this.formData.removeAt(i);
	}

	addField() {
		this.formData.push(this.field());
	}
}
