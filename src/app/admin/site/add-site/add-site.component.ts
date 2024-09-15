import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
	public siteSettingForm: FormGroup;
	accountList: any = [];
	countriesList: any = [];
	stateList: any = [];
	siteTypes = [
		{ id: 1, label: 'Hotel' },
		{ id: 2, label: 'Restaurant' },
	];
	selectedTab: number = 0;
	selectTabIndex: number = 0;
	allowAddSite: boolean = true;
	createdSiteId: number;

	themes = [
		{ id: 1, label: 'DEFAULT' },
		{ id: 2, label: 'CUSTOM 1' },
		{ id: 3, label: 'CUSTOM 2' },
		{ id: 4, label: 'CUSTOM 3' },
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
				country: [null],
				state: [null],
				mapLocation: [''],
				wifiDetails: new FormArray([]),
			});
		} else {
			const randomNumber = Math.floor(1000 + Math.random() * 9000);
			this.siteForm = this.formBuilder.group({
				account: [null],
				siteName: ['Site-' + randomNumber, SITE_NAME_VALIDATION],
				siteAddress: ['Address-' + randomNumber, SITE_ADDRESS_VALIDATION],
				type: [undefined, SITE_ACCOUNT_VALIDATION],
				country: [null],
				state: [null],
				mapLocation: [''],
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
		this.accountService.listCountries().subscribe((res) => {
			if (res.status) {
				this.countriesList = [...res.data];
				if (this.countriesList.length) {
					//call list state API
					this.listStatesAPI(this.countriesList[0]?.code);
				}
			}
		});
		this.globalService.formControlValuesChanged(this.siteForm);
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
				this.createdSiteId = res.data.id;
				const createdSiteSettings = res.data.settings;
				this.routeToSiteSetingsStep();
				this.patchSiteSettingsData(createdSiteSettings);
			} else {
				console.log('error');
			}
		});
	}

	listStatesAPI(cCode: string) {
		if (cCode) {
			this.accountService.listStates(cCode).subscribe((res) => {
				if (res.status) {
					this.stateList = [...res.data.states];
				}
			});
		}
	}

	field(): FormGroup {
		return this.formBuilder.group({
			username: ['', USER_NAME_VALIDATION],
			password: ['', PASSWORD_VALIDATION],
			showPassword: false,
		});
	}

	routeToSiteSetingsStep() {
		this.selectTabIndex = 1;
		this.selectedTab = 1;
		this.allowAddSite = false;
		this.siteForm.markAsPristine();
	}

	patchSiteSettingsData(siteSettings: any) {
		const { theme, serviceTax, sgst, cgst } = siteSettings;
		const orders = this.getStatusOfSiteConfig(siteSettings.orders);
		const foodOrder = this.getStatusOfSiteConfig(siteSettings.foodOrder);
		const amenitiesOrder = this.getStatusOfSiteConfig(
			siteSettings.amenitiesOrder
		);
		const orderHistory = this.getStatusOfSiteConfig(siteSettings.orderHistory);
		const callReception = this.getStatusOfSiteConfig(
			siteSettings.callReception
		);
		const roomService = this.getStatusOfSiteConfig(siteSettings.roomService);
		const cleaningService = this.getStatusOfSiteConfig(
			siteSettings.cleaningService
		);
		const wifi = this.getStatusOfSiteConfig(siteSettings.wifi);
		const sos = this.getStatusOfSiteConfig(siteSettings.sos);
		const events = this.getStatusOfSiteConfig(siteSettings.events);
		const feedback = this.getStatusOfSiteConfig(siteSettings.feedback);
		this.siteSettingForm = this.formBuilder.group({
			theme: [theme],
			serviceTax: [serviceTax],
			sgst: [sgst],
			cgst: [cgst],
			orders: [orders],
			foodOrder: [foodOrder],
			amenitiesOrder: [amenitiesOrder],
			orderHistory: [orderHistory],
			callReception: [callReception],
			roomService: [roomService],
			cleaningService: [cleaningService],
			wifi: [wifi],
			sos: [sos],
			events: [events],
			feedback: [feedback],
		});
	}

	routeToListSite() {
		if (!this.siteForm.dirty) {
			this.router.navigateByUrl(URL_ROUTES.LIST_SITE);
		} else {
			this.dialogService.openBackConfirmDialog().then((result) => {
				if (result.value) {
					this.router.navigateByUrl(URL_ROUTES.LIST_SITE);
					this.globalService.enableSideNavRouting();
				}
			});
		}
	}

	toggle(control): void {
		const statusControl = this.siteSettingForm.get(control) as FormControl;
		statusControl.setValue(!statusControl.value);
		//update site setting configuration
		const controlValue = this.siteSettingForm.get(control).value ? 1 : 0;
		this.siteService.updateSiteSetting(
			this.createdSiteId,
			control,
			controlValue
		);
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

	stepClicked(index: number) {
		if (index === 1) {
			if (this.siteForm.dirty || this.allowAddSite) {
				this.dialogService.enterSiteDetailsConfirmDialog().then((res) => {
					if (res.value) {
						this.selectTabIndex = 0;
						this.selectedTab = 0;
					}
				});
			} else {
				this.selectTabIndex = index;
				this.selectedTab = index;
			}
		} else if (index === 0 && this.allowAddSite == false) {
			this.siteForm.disable();
			this.selectTabIndex = index;
			this.selectedTab = index;
		}
	}

	getStatusOfSiteConfig(value: number) {
		return value === 1;
	}

	updateMiscConfig(control: string) {
		if (control) {
			const controlValue = this.siteSettingForm.get(control).value;
			if (controlValue) {
				this.siteService.updateSiteSetting(
					this.createdSiteId,
					control,
					controlValue
				);
			}
		}
	}
}
