import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { DEVICE_NAME_VALIDATION } from 'src/app/constants/validations';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountService } from '../../accounts/service/account.service';
import { DeviceService } from '../service/device.service';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
	selector: 'app-view-device',
	templateUrl: './view-device.component.html',
	styleUrls: ['./view-device.component.scss'],
})
export class ViewDeviceComponent {
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showListRooms: boolean = this.globalService.checkForPermission('LIST-ROOM');
	showEditDevice: boolean =
		this.globalService.checkForPermission('UPDATE-DEVICE');
	showListDevice: boolean =
		this.globalService.checkForPermission('LIST-DEVICE');
	showDeleteDevice: boolean =
		this.globalService.checkForPermission('DELETE-DEVICE');

	public deviceForm: FormGroup = this.formBuilder.group({
		account: [null],
		site: [null, Validators.required],
		room: [null],
		deviceName: ['', DEVICE_NAME_VALIDATION],
		status: [''],
	});

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		public accountService: AccountService,
		private activatedRoute: ActivatedRoute,
		private deviceService: DeviceService,
		private dialogService: DialogService
	) {}

	ngOnInit(): void {
		this.getDevice();
	}

	getDevice() {
		this.activatedRoute.params.subscribe((params) => {
			let deviceId = params['id'];
			this.deviceService.viewDevice(deviceId).then((res) => {
				if (res.status === true) {
					this.deviceForm.get('account').patchValue('asasa');
					this.deviceForm.get('site').patchValue(res.data.device.site.name);
					this.deviceForm
						.get('room')
						.patchValue(res.data.device.room ? res.data.device.room.name : '-');
					this.deviceForm.get('deviceName').patchValue(res.data.device.code);
					const status = res.data.device.status ? 1 : true ? 0 : false;
					this.deviceForm.get('status')?.patchValue(status);
					this.deviceForm.disable();
				}
			});
		});
	}
	routeToListDevice() {
		this.router.navigateByUrl(URL_ROUTES.LIST_DEVICE);
	}

	deleteDevice() {
		let deviceId: any;
		this.activatedRoute.params.subscribe((params) => {
			deviceId = params['id'];
		});
		this.dialogService.openConfirmDialog().then((result) => {
			if (result.value) {
				//call delete site API
				this.deviceService.deleteDevice(deviceId).then((res: any) => {
					if (res.status) {
						this.router.navigateByUrl(URL_ROUTES.LIST_DEVICE);
					}
				});
			}
		});
	}

	routeToEditDevice() {
		let deviceId: any;
		this.activatedRoute.params.subscribe((params) => {
			deviceId = params['id'];
		});
		this.router.navigateByUrl(URL_ROUTES.EDIT_DEVICE + '/' + deviceId);
	}
}
