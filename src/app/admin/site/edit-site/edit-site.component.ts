import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
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
	public siteSettingForm: FormGroup;
	accountList: any = [];
	siteTypes = [
		{ id: 1, label: 'Hotel' },
		{ id: 2, label: 'Restaurant' },
	];

	themes = [
		{ id: 1, label: 'DEFAULT' },
		{ id: 2, label: 'CUSTOM 1' },
		{ id: 3, label: 'CUSTOM 2' },
		{ id: 4, label: 'CUSTOM 3' },
	];
	currenciesList: any[] = [];
	showNoSiteAvailable: boolean = true;
	selectedTab: number = 0;
	selectTabIndex: number = 0;

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
				country: [null],
				state: [null],
				mapLocation: [null],
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
				country: [null],
				state: [null],
				mapLocation: [null],
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

	allowToStep = true;

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
		this.siteForm.markAsDirty();
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
					const {
						id,
						account,
						name,
						address,
						type,
						wifi,
						country,
						state,
						mapLocation,
					} = res.data;
					const siteForm = this.siteForm;

					this.siteData = res.data;
					siteForm.get('account').disable();
					siteForm.get('country').disable();
					siteForm.get('state').disable();
					siteForm.patchValue({
						id,
						account: account.name,
						siteName: name,
						siteAddress: address,
						type,
						country,
						state,
						mapLocation,
					});
					this.siteWifiDetails = [...res.data.wifi];
					this.initializeWifiDetails(wifi);
					this.patchSiteSettingsData(res.data.settings);
				}
			});
		});
	}

	routeToSiteSetingsStep() {
		this.selectTabIndex = 1;
		this.selectedTab = 1;
		this.siteForm.markAsPristine();
		this.siteForm.markAsUntouched();
	}

	updateSite() {
		this.siteService.updateSite(this.siteForm).then((res) => {
			if (res.status) {
				this.routeToSiteSetingsStep();
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

	patchSiteSettingsData(siteSettings: any) {
		const { theme, serviceTax, sgst, cgst, currency } = siteSettings;
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
			currency: [currency],
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

		this.listCurrenciesAPI();
	}

	listCurrenciesAPI() {
		this.accountService.listCurrencies().subscribe((res) => {
			if (res.status) {
				this.currenciesList = [...res.data];
			}
		});
	}

	getStatusOfSiteConfig(value: number) {
		return value === 1;
	}

	stepClicked(index: number) {
		if (index === 1) {
			if (this.siteForm.dirty) {
				this.dialogService.saveSiteDetailsFirst().then((res) => {
					if (res.value) {
						this.selectTabIndex = 0;
						this.selectedTab = 0;
					}
				});
			} else {
				this.selectTabIndex = index;
				this.selectedTab = index;
			}
		} else if (index === 0) {
			this.selectTabIndex = index;
			this.selectedTab = index;
		}
	}

	toggle(control): void {
		const statusControl = this.siteSettingForm.get(control) as FormControl;
		statusControl.setValue(!statusControl.value);
		//update site setting configuration
		const controlValue = this.siteSettingForm.get(control).value ? 1 : 0;
		this.siteService.updateSiteSetting(
			this.siteData?.id,
			control,
			controlValue
		);
	}

	updateMiscConfig(control: string) {
		const controlValue = this.siteSettingForm.get(control).value;
		this.siteService.updateSiteSetting(
			this.siteData?.id,
			control,
			controlValue
		);
	}
}
