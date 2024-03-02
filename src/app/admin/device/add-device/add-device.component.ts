import { Component, OnInit } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	Validators,
	FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { DEVICE_NAME_VALIDATION } from 'src/app/constants/validations';
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
import { RoomService } from '../../room/services/room.service';
import { DeviceService } from '../service/device.service';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
	selector: 'app-add-device',
	templateUrl: './add-device.component.html',
	styleUrls: ['./add-device.component.scss'],
})
export class AddDeviceComponent implements OnInit {
	isProduction = environment.production;
	public deviceForm: FormGroup;
	accountList: any = [];
	siteList: any = [];
	roomList: any = [];
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showListRooms: boolean = this.globalService.checkForPermission('LIST-ROOM');
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

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		public accountService: AccountService,
		private siteServices: SiteService,
		private roomService: RoomService,
		private deviceService: DeviceService,
		private dialogService: DialogService
	) {
		if (this.isProduction) {
			this.deviceForm = this.formBuilder.group({
				account: [null],
				site: [null, Validators.required],
				room: [null],
				deviceName: ['', DEVICE_NAME_VALIDATION],
				status: [true],
			});
		} else {
			const randomNumber = Math.floor(1000 + Math.random() * 9000);
			this.deviceForm = this.formBuilder.group({
				account: [null],
				site: [null, Validators.required],
				room: [null],
				deviceName: ['DV-' + randomNumber, DEVICE_NAME_VALIDATION],
				status: [true],
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
		this.deviceForm.get('status').disable();
	}
	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.siteList = [...res.data.sites];
				if (this.siteList.length) {
					this.roomParams.siteId = this.siteList[0].id;
					this.listRoomAPI(this.roomParams);
				}
			}
		});
	}

	listRoomAPI(params: IParams) {
		this.roomService.listRooms(params).subscribe((res) => {
			if (res.status) {
				this.roomList = [...res.data.rooms];
			}
		});
	}

	getPermissionLabel(permissionName: string): string {
		return permissionName.split('-')[0];
	}

	routeToListDevice() {
		if (!this.deviceForm.dirty) {
			this.router.navigateByUrl(URL_ROUTES.LIST_DEVICE);
		} else {
			this.dialogService.openBackConfirmDialog().then((result) => {
				if (result.value) {
					this.router.navigateByUrl(URL_ROUTES.LIST_DEVICE);
				}
			});
		}
	}

	//form validation function
	isError(formControlName: string, errorType: string): boolean {
		return hasError(this.deviceForm, formControlName, errorType);
	}

	showError(formControlName: string): boolean {
		return isValid(this.deviceForm, formControlName);
	}

	showSuccess(formControlName: string): boolean {
		return isTouchedAndValid(this.deviceForm, formControlName);
	}

	formTouched(formControlName: string): boolean {
		return isTouched(this.deviceForm, formControlName);
	}

	errorMessage(formControlName: string, errorType: string): string {
		return errorMessages[formControlName][errorType];
	}

	changeAccountData(accountId: any) {
		this.siteParams.accountId = accountId;
		this.deviceForm.get('account').patchValue(accountId);
		this.listSiteAPI(this.siteParams);
	}

	changeSiteData(siteId: any) {
		const randomNumber = Math.floor(1000 + Math.random() * 9000);
		this.roomParams.siteId = siteId;
		this.deviceForm
			.get('deviceName')
			.patchValue(`DV_${siteId}_${randomNumber}`);
		this.listRoomAPI(this.roomParams);
	}

	addDevice() {
		this.deviceService.addDevice(this.deviceForm).then((res) => {
			if (res.status) {
				this.router.navigate([URL_ROUTES.LIST_DEVICE]);
			} else {
				console.log('error');
			}
		});
	}

	toggle(): void {
		const statusControl = this.deviceForm.get('status') as FormControl;
		statusControl.setValue(!statusControl.value);
	}
}
