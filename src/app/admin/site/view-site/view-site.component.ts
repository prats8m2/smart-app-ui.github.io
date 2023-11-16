import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import {
	SITE_NAME_VALIDATION,
	SITE_ADDRESS_VALIDATION,
	SITE_ACCOUNT_VALIDATION,
	USER_NAME_VALIDATION,
	PASSWORD_VALIDATION,
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
import { SiteService } from '../service/site.service';

@Component({
	selector: 'app-view-site',
	templateUrl: './view-site.component.html',
	styleUrls: ['./view-site.component.scss'],
})
export class ViewSiteComponent {
	isProduction = environment.production;
	public siteForm: FormGroup = this.formBuilder.group({
		account: [null],
		siteName: ['', SITE_NAME_VALIDATION],
		siteAddress: ['', SITE_ADDRESS_VALIDATION],
		type: [undefined, SITE_ACCOUNT_VALIDATION],
		wifiDetails: new FormArray([]),
	});
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
		private activatedRoute: ActivatedRoute
	) {}

	showListAccount: boolean = this.globalService.checkForPermission('LIST-USER');
	siteWifiDetails: any = [];

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
		this.getSite();
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

	field(): FormGroup {
		return this.formBuilder.group({
			username: ['', USER_NAME_VALIDATION],
			password: ['', PASSWORD_VALIDATION],
		});
	}

	routeToListSite() {
		this.router.navigateByUrl(URL_ROUTES.LIST_SITE);
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

	showFormValue() {
		console.log(this.siteForm.value);
	}

	getSite() {
		this.activatedRoute.params.subscribe((params) => {
			let siteId = params['id'];
			console.log("params['id'];:", params);
			this.siteForm.value.id = params['id'];
			this.siteService.viewSite(siteId).then((res) => {
				if (res.status === true) {
					this.siteForm.disable();
					this.siteForm.patchValue(res.data);
					this.siteForm.get('account')?.patchValue(res.data.account.name);
					this.siteForm.get('siteName')?.patchValue(res.data.name);
					this.siteForm.get('siteAddress')?.patchValue(res.data.address);
					const type =
						res.data.type === 1
							? 'HOTEL'
							: res.data.type === 2
							? 'RESTAURANT'
							: undefined;
					this.siteForm.get('type')?.patchValue(type);
					this.siteWifiDetails = [...res.data.wifi];
				}
			});
		});
	}
}
