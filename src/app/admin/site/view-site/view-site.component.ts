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
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountService } from '../../accounts/service/account.service';
import { SiteService } from '../service/site.service';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
	selector: 'app-view-site',
	templateUrl: './view-site.component.html',
	styleUrls: ['./view-site.component.scss'],
})
export class ViewSiteComponent {
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
		private activatedRoute: ActivatedRoute,
		private dialogService: DialogService
	) {}

	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showDeleteSite: boolean =
		this.globalService.checkForPermission('DELETE-SITE');
	showEditSite: boolean = this.globalService.checkForPermission('UPDATE-SITE');
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

	getSite() {
		this.activatedRoute.params.subscribe((params) => {
			let siteId = params['id'];
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

	deleteSite() {
		let siteId: any;
		this.activatedRoute.params.subscribe((params) => {
			siteId = params['id'];
		});
		this.dialogService.openDeleteConfirmDialog().then((result) => {
			if (result.value) {
				//call delete site API
				this.siteService.deleteSite(siteId).then((res: any) => {
					if (res.status) {
						this.router.navigateByUrl(URL_ROUTES.LIST_SITE);
					}
				});
			}
		});
	}

	routeToEditSite() {
		let siteId: any;
		this.activatedRoute.params.subscribe((params) => {
			siteId = params['id'];
		});

		this.router.navigateByUrl(URL_ROUTES.EDIT_SITE + '/' + siteId);
	}
}
