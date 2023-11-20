import { Component, OnInit } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	Validators,
	FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { ROOM_NAME_VALIDATION } from 'src/app/constants/validations';
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
import { RoleService } from '../../role/service/role.service';
import { SiteService } from '../../site/service/site.service';
import { DeviceService } from '../../device/service/device.service';
import { RoomService } from '../services/room.service';

@Component({
	selector: 'app-add-room',
	templateUrl: './add-room.component.html',
	styleUrls: ['./add-room.component.scss'],
})
export class AddRoomComponent implements OnInit {
	isProduction = environment.production;
	public roomForm: FormGroup;
	accountList: any = [];
	siteList: any = [];
	roleList: any = [];
	wifiList: any = [];
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

	roleParams: IParams = {
		accountId: null,
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
		private roleService: RoleService,
		private deviceService: DeviceService,
		private roomService: RoomService
	) {
		if (this.isProduction) {
			this.roomForm = this.formBuilder.group({
				account: [null],
				site: [null, Validators.required],
				wifi: [null],
				device: [null, Validators.required],
				status: [true],
				roomName: ['', ROOM_NAME_VALIDATION],
			});
		} else {
			const randomNumber = Math.floor(1000 + Math.random() * 9000);
			this.roomForm = this.formBuilder.group({
				account: [null],
				site: [null, Validators.required],
				wifi: [[]],
				device: [null, Validators.required],
				status: [true],

				roomName: ['Room-' + randomNumber, ROOM_NAME_VALIDATION],
			});
		}
	}

	ngOnInit(): void {
		if (this.showListAccount) {
			this.accountService.listUser(this.accountParams).subscribe((res) => {
				if (res.status) {
					this.accountList = [...res.data.users];
					this.siteParams.accountId = this.accountList[0].account.id;
					this.roleParams.accountId = this.accountList[0].account.id;
					this.listSiteAPI(this.siteParams);
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
				this.listRoleAPI(this.roleParams);
			}
		});
	}

	listRoleAPI(params: IParams) {
		this.roleService.listRoles(params).subscribe((res) => {
			if (res.status) {
				this.roleList = [...res.data.roles];
			}
		});
	}

	getPermissionLabel(permissionName: string): string {
		return permissionName.split('-')[0];
	}

	routeToListRoom() {
		this.router.navigateByUrl(URL_ROUTES.LIST_ROOM);
	}

	//form validation function
	isError(formControlName: string, errorType: string): boolean {
		return hasError(this.roomForm, formControlName, errorType);
	}

	showError(formControlName: string): boolean {
		return isValid(this.roomForm, formControlName);
	}

	showSuccess(formControlName: string): boolean {
		return isTouchedAndValid(this.roomForm, formControlName);
	}

	formTouched(formControlName: string): boolean {
		return isTouched(this.roomForm, formControlName);
	}

	errorMessage(formControlName: string, errorType: string): string {
		return errorMessages[formControlName][errorType];
	}

	changeAccountData(accountId: any) {
		this.siteParams.accountId = accountId;
		this.roleParams.accountId = accountId;
		this.roomForm.get('account').patchValue(accountId);
		this.listSiteAPI(this.siteParams);
		this.listRoleAPI(this.roleParams);
	}

	changeRoleData(roleId: any) {
		this.roomForm.get('role').patchValue(roleId);
	}

	addRoom() {
		const selectedWifiIds = this.roomForm.get('wifi').value;

		const selectedWifiObjects = selectedWifiIds.map((id: number) => ({
			id,
		}));
		this.roomForm.get('wifi').patchValue(selectedWifiObjects);
		this.roomService.addRoom(this.roomForm).then((res) => {
			if (res.status) {
				this.router.navigate([URL_ROUTES.LIST_ROOM]);
			} else {
				console.log('error');
			}
		});
	}

	toggle(): void {
		const statusControl = this.roomForm.get('status') as FormControl;
		statusControl.setValue(!statusControl.value);
	}

	changeSiteData(siteId: any) {
		this.siteServices.viewSite(siteId).then((res) => {
			this.wifiList = [...res.data.wifi];
		});

		this.deviceParams.siteId = siteId;
		this.listDeviceAPI(this.deviceParams);
	}

	listDeviceAPI(params: IParams) {
		this.deviceService.listDevice(this.deviceParams).subscribe((res) => {
			this.deviceList = [...res.data.devices];
		});
	}
}
