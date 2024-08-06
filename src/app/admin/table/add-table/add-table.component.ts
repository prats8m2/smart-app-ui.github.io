import { Component, OnInit } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	Validators,
	FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import {
	ROOM_NAME_VALIDATION,
	TABLE_NAME_VALIDATION,
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
import { DeviceService } from '../../device/service/device.service';
import { RoomService } from '../../room/services/room.service';
import { SiteService } from '../../site/service/site.service';
import { TableService } from '../services/table.service';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
	selector: 'app-add-table',
	templateUrl: './add-table.component.html',
	styleUrls: ['./add-table.component.scss'],
})
export class AddTableComponent implements OnInit {
	isProduction = environment.production;
	public tableForm: FormGroup;
	accountList: any = [];
	siteList: any = [];
	roleList: any = [];
	deviceList: any = [];
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showListRole: boolean = this.globalService.checkForPermission('LIST-ROLE');
	accountParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};

	siteParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};

	roomParams: IParams = {
		siteId: null,
		limit: 100,
		pageNumber: 1,
	};

	deviceParams: IParams = {
		siteId: null,
		limit: 100,
		pageNumber: 1,
	};

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		public accountService: AccountService,
		private siteServices: SiteService,
		private deviceService: DeviceService,
		private roomService: RoomService,
		private tableService: TableService,
		private dialogService: DialogService
	) {
		if (this.isProduction) {
			this.tableForm = this.formBuilder.group({
				account: [null],
				site: [null, Validators.required],
				device: [null, Validators.required],
				tableName: ['', TABLE_NAME_VALIDATION],
			});
		} else {
			const randomNumber = Math.floor(1000 + Math.random() * 9000);
			this.tableForm = this.formBuilder.group({
				account: [null],
				site: [null, Validators.required],
				device: [null, Validators.required],
				tableName: ['Table-' + randomNumber, TABLE_NAME_VALIDATION],
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
		this.globalService.formControlValuesChanged(this.tableForm);
	}
	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.siteList = [...res.data.sites];
				if (this.siteList.length) {
					this.deviceParams.siteId = this.siteList[0]?.id;
					this.changeSiteData(this.siteList[0]?.id);
				}
			}
		});
	}

	routeToListTable() {
		if (!this.tableForm.dirty) {
			this.router.navigateByUrl(URL_ROUTES.LIST_TABLE);
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
		return hasError(this.tableForm, formControlName, errorType);
	}

	showError(formControlName: string): boolean {
		return isValid(this.tableForm, formControlName);
	}

	showSuccess(formControlName: string): boolean {
		return isTouchedAndValid(this.tableForm, formControlName);
	}

	formTouched(formControlName: string): boolean {
		return isTouched(this.tableForm, formControlName);
	}

	errorMessage(formControlName: string, errorType: string): string {
		return errorMessages[formControlName][errorType];
	}

	changeAccountData(accountId: any) {
		this.siteParams.accountId = accountId;
		this.listSiteAPI(this.siteParams);
	}

	addTable() {
		this.tableService.addTable(this.tableForm).then((res) => {
			if (res.status) {
				this.router.navigate([URL_ROUTES.LIST_TABLE]);
			} else {
				console.log('error');
			}
		});
	}

	changeSiteData(siteId: any) {
		this.deviceParams.siteId = siteId;
		this.listDeviceAPI(this.deviceParams);
	}

	listDeviceAPI(params: IParams) {
		this.deviceService.listAvailableDevice(params).subscribe((res) => {
			this.deviceList = [...res.data.devices];
		});
	}
}
