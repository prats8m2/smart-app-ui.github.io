import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { IParams } from 'src/app/core/interface/params';
import { DialogService } from 'src/app/core/services/dialog.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountService } from '../../accounts/service/account.service';
import { DeviceService } from '../../device/service/device.service';
import { RoomService } from '../../room/services/room.service';
import { SiteService } from '../../site/service/site.service';
import { TableService } from '../services/table.service';

@Component({
	selector: 'app-list-table',
	templateUrl: './list-table.component.html',
	styleUrls: ['./list-table.component.scss'],
})
export class ListTableComponent implements OnInit {
	sitesList: any = [];
	constructor(
		public accountService: AccountService,
		private router: Router,
		private globalService: GlobalService,
		private siteServices: SiteService,
		private deviceService: DeviceService,
		private dialogService: DialogService,
		private roomService: RoomService,
		private tableService: TableService
	) {}

	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showAddTable: boolean = this.globalService.checkForPermission('ADD-TABLE');
	showEditTable: boolean =
		this.globalService.checkForPermission('UPDATE-TABLE');
	showViewTable: boolean = this.globalService.checkForPermission('VIEW-TABLE');
	showDeleteTable: boolean =
		this.globalService.checkForPermission('DELETE-TABLE');
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
	tableList: any = [];

	tableListResp: any = [];
	total: number;
	perPage: number = 10;
	currentPage: number = 1;
	searchInput: string = '';
	roomParams: IParams = {
		siteId: null,
		limit: 100,
		pageNumber: 1,
	};

	tableParams: IParams = {
		siteId: null,
		limit: 100,
		pageNumber: 1,
	};

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
	}

	routeToAddTable() {
		this.router.navigateByUrl(URL_ROUTES.ADD_TABLE);
	}

	routeToEditTable(roomId: any) {
		this.router.navigateByUrl(URL_ROUTES.EDIT_TABLE + '/' + roomId);
	}
	routeToViewTable(roomId: any) {
		if (this.showViewTable) {
			this.router.navigateByUrl(URL_ROUTES.VIEW_TABLE + '/' + roomId);
		}
	}

	pageChanged(event: any): void {
		this.currentPage = event.page;
		this.updateDisplayedData();
	}

	updateDisplayedData(): void {
		const startIndex = (this.currentPage - 1) * this.perPage;
		const endIndex = startIndex + this.perPage;
		this.tableList = this.tableListResp
			.slice(startIndex, endIndex)
			.filter(
				(item) =>
					item.name.toLowerCase().includes(this.searchInput.toLowerCase()) ||
					item.device.code
						.toLowerCase()
						.includes(this.searchInput.toLowerCase())
			);

		this.total = this.searchInput
			? this.tableList.length
			: this.tableListResp.length;
	}

	onSearch(): void {
		this.currentPage = 1;
		this.updateDisplayedData();
	}

	changeAccountData(accountId: any) {
		this.tableListResp = [];
		this.updateDisplayedData();
		this.siteParams.accountId = accountId;
		this.listSiteAPI(this.siteParams);
	}

	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.sitesList = [...res.data.sites];
				if (this.sitesList.length) {
					this.tableParams.siteId = this.sitesList[0].id;
					this.listTableAPI(this.tableParams);
				}
			}
		});
	}
	changeSitesData(siteId: any) {
		this.tableParams.siteId = siteId;
		this.listTableAPI(this.tableParams);
	}

	listTableAPI(params: IParams) {
		this.tableService.listTable(params).subscribe((res) => {
			if (res.status) {
				this.tableListResp = [...res.data.tables];
				this.updateDisplayedData();
			}
		});
	}

	openConfirmDialog(tableId: any) {
		this.dialogService.openConfirmDialog().then((result) => {
			if (result.value) {
				this.tableService.deleteTable(tableId).then((res: any) => {
					if (res.status) {
						this.listTableAPI(this.tableParams);
					}
				});
			}
		});
	}
}
