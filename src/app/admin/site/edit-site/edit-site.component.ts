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
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
	selector: 'app-edit-site',
	templateUrl: './edit-site.component.html',
	styleUrls: ['./edit-site.component.scss'],
})
export class EditSiteComponent {
	isProduction = environment.production;
	public siteForm: FormGroup;
	accountList: any = [];
	siteTypes = [
		{ id: 1, label: 'Hotel' },
		{ id: 2, label: 'Restaurant' },
	];
	showNoSiteAvailable: boolean = true;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		private siteService: SiteService,
		public accountService: AccountService,
		private activatedRoute: ActivatedRoute,
		private dialogService: DialogService
	) {
		if (this.isProduction) {
			this.siteForm = this.formBuilder.group({
				id: [''],
				account: [null],
				siteName: ['', SITE_NAME_VALIDATION],
				siteAddress: ['', SITE_ADDRESS_VALIDATION],
				type: [undefined, SITE_ACCOUNT_VALIDATION],
				wifiDetails: new FormArray([]),
			});
		} else {
			const randomNumber = Math.floor(1000 + Math.random() * 9000);
			this.siteForm = this.formBuilder.group({
				id: [''],
				account: [null],
				siteName: ['Site-' + randomNumber, SITE_NAME_VALIDATION],
				siteAddress: ['Address-' + randomNumber, SITE_ADDRESS_VALIDATION],
				type: [undefined, SITE_ACCOUNT_VALIDATION],
				wifiDetails: new FormArray([]),
			});
		}
	}
	siteWifiDetails: any = [];

	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	siteData: any = [];

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
		this.showNoSiteAvailable = false;
		this.formData.push(this.field());
	}

	getSite() {
		this.activatedRoute.params.subscribe((params) => {
			let siteId = params['id'];
			this.siteForm.value.id = params['id'];
			this.siteService.viewSite(siteId).then((res) => {
				if (res.status === true) {
					const { id, account, name, address, type, wifi } = res.data;
					const siteForm = this.siteForm;

					this.siteData = res.data;
					siteForm.get('account').disable();
					siteForm.patchValue({
						id,
						account: account.name,
						siteName: name,
						siteAddress: address,
						type,
					});
					this.siteWifiDetails = [...res.data.wifi];
					this.initializeWifiDetails(wifi);
				}
			});
		});
	}

	updateSite() {
		this.siteService.updateSite(this.siteForm).then((res) => {
			if (res.status) {
				this.router.navigate([URL_ROUTES.LIST_SITE]);
			} else {
				console.log('error');
			}
		});
	}
	initializeWifiDetails(data: any[]): void {
		const wifiDetailsFormArray: any = this.formBuilder.array([]);
		data.forEach((item: any) => {
			wifiDetailsFormArray.push(this.createWifiDetailFormGroup(item));
		});
		this.siteForm.setControl('wifiDetails', wifiDetailsFormArray);
	}

	createWifiDetailFormGroup(data: any): FormGroup {
		return this.formBuilder.group({
			username: [data.username],
			password: ['Pass@1234'],
		});
	}
}
