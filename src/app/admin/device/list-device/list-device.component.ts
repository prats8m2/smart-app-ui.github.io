import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountService } from '../../accounts/service/account.service';
import { SiteService } from '../../site/service/site.service';
import { IParams } from 'src/app/core/interface/params';
import { URL_ROUTES } from 'src/app/constants/routing';
import { DeviceService } from '../service/device.service';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
	selector: 'app-list-device',
	templateUrl: './list-device.component.html',
	styleUrls: ['./list-device.component.scss'],
})
export class ListDeviceComponent implements OnInit {
	sitesList: any = [];
	constructor(
		public accountService: AccountService,
		private router: Router,
		private globalService: GlobalService,
		private siteServices: SiteService,
		private deviceService: DeviceService,
		private dialogService: DialogService
	) {}

	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showAddDevice: boolean = this.globalService.checkForPermission('ADD-DEVICE');
	showViewDevice: boolean =
		this.globalService.checkForPermission('VIEW-DEVICE');

	showEditDevice: boolean =
		this.globalService.checkForPermission('UPDATE-DEVICE');
	showDeleteDevice: boolean =
		this.globalService.checkForPermission('DELETE-DEVICE');

	accountParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};
	siteParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};

	accountList: any = [];
	deviceList: any = [];

	deviceListResp: any = [];
	total: number;
	perPage: number = 10;
	currentPage: number = 1;
	searchInput: string = '';
	deviceParams: IParams = {
		siteId: null,
		limit: 100,
		pageNumber: 1,
	};

	ngOnInit(): void {
		if (this.showListAccount) {
			this.accountService.listUser(this.accountParams).subscribe((res) => {
				if (res.status) {
					this.accountList = [...res.data.users];
					this.siteParams.accountId = this.accountList[0]?.account.id;
					this.listSiteAPI(this.siteParams);
				}
			});
		} else {
			this.listSiteAPI(this.siteParams);
		}
	}

	routeToAddDevice() {
		this.router.navigateByUrl(URL_ROUTES.ADD_DEVICE);
	}

	routeToEditDevice(deviceId: any) {
		this.router.navigateByUrl(URL_ROUTES.EDIT_DEVICE + '/' + deviceId);
	}
	routeToViewDevice(deviceId: any) {
		if (this.showViewDevice) {
			this.router.navigateByUrl(URL_ROUTES.VIEW_DEVICE + '/' + deviceId);
		}
	}

	pageChanged(event: any): void {
		this.currentPage = event.page;
		this.updateDisplayedData();
	}

	updateDisplayedData(): void {
		const startIndex = (this.currentPage - 1) * this.perPage;
		const endIndex = startIndex + this.perPage;
		this.deviceList = this.deviceListResp
			.slice(startIndex, endIndex)
			.filter((item) =>
				item.code.toLowerCase().includes(this.searchInput.toLowerCase())
			);

		this.total = this.searchInput
			? this.deviceList.length
			: this.deviceListResp.length;
	}

	onSearch(): void {
		this.currentPage = 1;
		this.updateDisplayedData();
	}

	changeAccountData(accountId: any) {
		this.deviceListResp = [];
		this.updateDisplayedData();
		this.siteParams.accountId = accountId;
		this.listSiteAPI(this.siteParams);
	}

	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.sitesList = [...res.data.sites];
				this.deviceParams.siteId = this.sitesList[0]?.id;
				this.listDeviceAPI(this.deviceParams);
			}
		});
	}
	changeSitesData(siteId: any) {
		this.deviceParams.siteId = siteId;
		this.listDeviceAPI(this.deviceParams);
	}

	listDeviceAPI(params: IParams) {
		this.deviceService.listDevice(params).subscribe((res) => {
			if (res.status) {
				this.deviceListResp = [...res.data.devices];
				this.updateDisplayedData();
			}
		});
	}

	openConfirmDialog(deviceId: any) {
		this.dialogService.openConfirmDialog().then((result) => {
			if (result.value) {
				//call delete device API
				this.deviceService.deleteDevice(deviceId).then((res: any) => {
					if (res.status) {
						this.listDeviceAPI(this.deviceParams);
					}
				});
			}
		});
	}
}
