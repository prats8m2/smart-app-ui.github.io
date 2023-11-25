import { Component, OnInit } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	Validators,
	FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { RoomService } from '../../room/services/room.service';
import { SiteService } from '../../site/service/site.service';
import { DeviceService } from '../service/device.service';

@Component({
	selector: 'app-edit-device',
	templateUrl: './edit-device.component.html',
	styleUrls: ['./edit-device.component.scss'],
})
export class EditDeviceComponent implements OnInit {
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
		private activatedRoute: ActivatedRoute
	) {
		if (this.isProduction) {
			this.deviceForm = this.formBuilder.group({
				id: [''],
				account: [null],
				site: [null, Validators.required],
				room: [null, Validators.required],
				deviceName: ['', DEVICE_NAME_VALIDATION],
				status: [null],
			});
		} else {
			this.deviceForm = this.formBuilder.group({
				id: [''],
				account: [null],
				site: [null, Validators.required],
				room: [null, Validators.required],
				deviceName: ['', DEVICE_NAME_VALIDATION],
				status: [null],
			});
		}
	}

	ngOnInit(): void {
		this.getDevice();
	}
	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.siteList = [...res.data.sites];
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
		this.router.navigateByUrl(URL_ROUTES.LIST_DEVICE);
	}

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

	getDevice() {
		this.activatedRoute.params.subscribe((params) => {
			let deviceId = params['id'];
			this.deviceService.viewDevice(deviceId).then((res) => {
				if (res.status === true) {
					const { device } = res.data;
					this.deviceForm.patchValue({
						id: deviceId,
						site: device.site.name,
						room: device.room?.id || null,
						deviceName: device.code,
						status: device.status ? true : false,
					});
					this.deviceForm.get('site').disable();
					this.deviceForm.get('account').disable();
					this.roomParams.siteId = device.site.id;
					this.listRoomAPI(this.roomParams);
				}
			});
		});
	}

	toggle(): void {
		const statusControl = this.deviceForm.get('status') as FormControl;
		statusControl.setValue(!statusControl.value);
	}

	updateDevice() {
		this.deviceService.updateDevice(this.deviceForm).then((res) => {
			if (res.status) {
				this.router.navigate([URL_ROUTES.LIST_DEVICE]);
			} else {
				console.log('error');
			}
		});
	}
}
