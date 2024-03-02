import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
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
		site: [null],
		room: [null],
		deviceName: [null],
		status: [null],
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
					const deviceForm = this.deviceForm;
					const { device } = res.data;

					deviceForm.patchValue({
						account: 'asasa',
						site: device.site.name,
						room: device.room ? device.room.name : '-',
						deviceName: device.code,
						status: device.status ? 1 : 0,
					});

					deviceForm.disable();
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
		this.dialogService.openDeleteConfirmDialog().then((result) => {
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
