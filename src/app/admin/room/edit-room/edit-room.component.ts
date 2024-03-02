import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { ROOM_NAME_VALIDATION } from 'src/app/constants/validations';
import { DialogService } from 'src/app/core/services/dialog.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../accounts/service/account.service';
import { RoomService } from '../services/room.service';
import {
	hasError,
	isValid,
	isTouchedAndValid,
	isTouched,
} from 'src/app/core/helpers/form-error';
import { errorMessages } from 'src/app/core/helpers/form-error-message';
import { DeviceService } from '../../device/service/device.service';
import { IParams } from 'src/app/core/interface/params';
import { SiteService } from '../../site/service/site.service';

@Component({
	selector: 'app-edit-room',
	templateUrl: './edit-room.component.html',
	styleUrls: ['./edit-room.component.scss'],
})
export class EditRoomComponent implements OnInit {
	isProduction = environment.production;

	public roomForm: FormGroup = this.formBuilder.group({
		id: [null],
		account: [null],
		site: [null],
		wifi: [[]],
		device: [null],
		status: [null],
		roomName: [null, ROOM_NAME_VALIDATION],
		occupied: [null],
	});

	deviceParams: IParams = {
		siteId: null,
		limit: 100,
		pageNumber: 1,
	};

	siteParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showListRole: boolean = this.globalService.checkForPermission('LIST-ROLE');
	showListRoom: boolean = this.globalService.checkForPermission('LIST-ROOM');
	showEditRoom: boolean = this.globalService.checkForPermission('UPDATE-ROOM');
	showDeleteRoom: boolean =
		this.globalService.checkForPermission('DELETE-ROOM');

	deviceList: any = [];
	wifiList: any = [];
	siteList: any = [];
	selectedDevice: any;
	roomSiteId: any;
	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		public accountService: AccountService,
		private activatedRoute: ActivatedRoute,
		private dialogService: DialogService,
		private roomService: RoomService,
		private deviceService: DeviceService,
		private siteService: SiteService
	) {}

	ngOnInit(): void {
		this.getRoom();
	}

	getRoom() {
		this.activatedRoute.params.subscribe((params) => {
			let roomId = params['id'];
			this.roomService.viewRoom(roomId).then((res) => {
				if (res.status) {
					let data = res.data;
					let occupiedStatus = data?.occupied === 1 ? true : false;
					let roomStatus = data?.status === 1 ? true : false;
					this.roomForm.patchValue({
						id: roomId,
						account: data?.site?.account?.name,
						site: data?.site?.name,
						roomName: data?.name,
						status: roomStatus,
						occupied: occupiedStatus,
						device: data?.device?.id,
						wifi: data.wifi.map((wifi) => wifi?.id),
					});
					this.roomForm.get('account').disable();
					this.roomForm.get('site').disable();
					this.wifiList = data?.site?.wifi;
					this.roomSiteId = data?.site?.id;
					this.listDeviceAPI(data?.site?.id);
					this.selectedDevice = data?.device;
				}
			});
		});
	}

	listSiteAPI(accountId: any) {
		this.siteParams.accountId = accountId;
		this.siteService.listSites(this.siteParams).subscribe((res) => {
			if (res.status) {
				this.siteList = [...res.data.sites];
			}
		});
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

	routeToListRoom() {
		if (!this.roomForm.dirty) {
			this.router.navigateByUrl(URL_ROUTES.LIST_ROOM);
		} else {
			this.dialogService.openBackConfirmDialog().then((result) => {
				if (result.value) {
					this.router.navigateByUrl(URL_ROUTES.LIST_ROOM);
				}
			});
		}
	}

	listDeviceAPI(siteId: any) {
		this.deviceParams.siteId = siteId;
		this.deviceService
			.listAvailableDevice(this.deviceParams)
			.subscribe((res: any) => {
				if (res.status) {
					this.deviceList = [...res.data.devices];
					this.deviceList.push(this.selectedDevice);
				}
			});
	}

	updateRoom() {
		const selectedWifiIds = this.roomForm.get('wifi').value;
		const selectedSiteObjects = selectedWifiIds.map((id: number) => ({
			id,
		}));
		this.roomForm.get('wifi').patchValue(selectedSiteObjects);
		this.roomService
			.updateRoom(this.roomForm, this.roomSiteId)
			.then((res: any) => {
				if (res.status) {
					this.routeToListRoom();
				} else {
					console.log('error');
				}
			});
	}

	getSite(siteId: any) {
		this.siteService.viewSite(siteId).then((res: any) => {
			if (res.status) {
				this.wifiList = [...res.data.wifi];
			}
		});
	}
}
