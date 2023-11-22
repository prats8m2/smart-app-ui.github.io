import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../accounts/service/account.service';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { IParams } from 'src/app/core/interface/params';
import { DialogService } from 'src/app/core/services/dialog.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { DeviceService } from '../../device/service/device.service';
import { SiteService } from '../../site/service/site.service';
import { RoomService } from '../services/room.service';

@Component({
	selector: 'app-list-room',
	templateUrl: './list-room.component.html',
	styleUrls: ['./list-room.component.scss'],
})
export class ListRoomComponent implements OnInit {
	sitesList: any = [];
	constructor(
		public accountService: AccountService,
		private router: Router,
		private globalService: GlobalService,
		private siteServices: SiteService,
		private deviceService: DeviceService,
		private dialogService: DialogService,
		private roomService: RoomService
	) {}

	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showAddRoom: boolean = this.globalService.checkForPermission('ADD-ROOM');
	showEditRoom: boolean = this.globalService.checkForPermission('UPDATE-ROOM');
	showViewRoom: boolean = this.globalService.checkForPermission('VIEW-ROOM');
	showDeleteRoom: boolean =
		this.globalService.checkForPermission('DELETE-ROOM');
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

	roomListResp: any = [];
	total: number;
	perPage: number = 10;
	currentPage: number = 1;
	searchInput: string = '';
	roomParams: IParams = {
		siteId: null,
		limit: 100,
		pageNumber: 1,
	};

	ngOnInit(): void {
		if (this.showListAccount) {
			this.accountService.listUser(this.accountParams).subscribe((res) => {
				if (res.status) {
					this.accountList = [...res.data.users];
				}
			});
		} else {
			this.listSiteAPI(this.siteParams);
		}
	}

	routeToAddRoom() {
		this.router.navigateByUrl(URL_ROUTES.ADD_ROOM);
	}

	routeToEditRoom(roomId: any) {
		this.router.navigateByUrl(URL_ROUTES.EDIT_ROOM + '/' + roomId);
	}
	routeToViewRoom(roomId: any) {
		if (this.showViewRoom) {
			this.router.navigateByUrl(URL_ROUTES.VIEW_ROOM + '/' + roomId);
		}
	}

	pageChanged(event: any): void {
		this.currentPage = event.page;
		this.updateDisplayedData();
	}

	updateDisplayedData(): void {
		const startIndex = (this.currentPage - 1) * this.perPage;
		const endIndex = startIndex + this.perPage;
		this.deviceList = this.roomListResp
			.slice(startIndex, endIndex)
			.filter((item) =>
				item.name.toLowerCase().includes(this.searchInput.toLowerCase())
			);

		this.total = this.searchInput
			? this.deviceList.length
			: this.roomListResp.length;
	}

	onSearch(): void {
		this.currentPage = 1;
		this.updateDisplayedData();
	}

	changeAccountData(accountId: any) {
		this.roomListResp = [];
		this.updateDisplayedData();
		this.siteParams.accountId = accountId;
		this.listSiteAPI(this.siteParams);
	}

	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.sitesList = [...res.data.sites];
			}
		});
	}
	changeSitesData(siteId: any) {
		this.roomParams.siteId = siteId;
		this.listRoomAPI(this.roomParams);
	}

	listRoomAPI(params: IParams) {
		this.roomService.listRooms(params).subscribe((res) => {
			if (res.status) {
				this.roomListResp = [...res.data.rooms];
				this.updateDisplayedData();
			}
		});
	}

	openConfirmDialog(deviceId: any) {
		this.dialogService.openConfirmDialog().then((result) => {
			if (result.value) {
				//call delete room API
				this.deviceService.deleteDevice(deviceId).then((res: any) => {
					if (res.status) {
						this.listRoomAPI(this.roomParams);
					}
				});
			}
		});
	}
}
