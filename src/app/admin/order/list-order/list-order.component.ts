import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { IParams } from 'src/app/core/interface/params';
import { DialogService } from 'src/app/core/services/dialog.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountService } from '../../accounts/service/account.service';
import { MenuService } from '../../menu/service/menu.service';
import { SiteService } from '../../site/service/site.service';

@Component({
	selector: 'app-list-order',
	templateUrl: './list-order.component.html',
	styleUrls: ['./list-order.component.scss'],
})
export class ListOrderComponent implements OnInit {
	constructor(
		public accountService: AccountService,
		private router: Router,
		private globalService: GlobalService,
		private siteServices: SiteService,
		private dialogService: DialogService
	) {}

	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showAddOrder: boolean = this.globalService.checkForPermission('ADD-ORDER');
	showViewOrder: boolean = this.globalService.checkForPermission('VIEW-ORDER');
	showEditOrder: boolean =
		this.globalService.checkForPermission('UPDATE-ORDER');
	showDeleteOrder: boolean =
		this.globalService.checkForPermission('DELETE-ORDER');

	siteParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};

	accountParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};

	orderList: any = [];
	orderListResp: any = [];
	sitesList: any = [];

	accountList: any = [];
	total: number;
	perPage: number = 10;
	currentPage: number = 1;
	searchInput: string = '';

	ngOnInit(): void {
		if (this.showListAccount) {
			this.accountService.listUser(this.accountParams).subscribe((res) => {
				if (res.status) {
					this.accountList = [...res.data.users];
					if (this.accountList.length) {
						this.siteParams.accountId = this.accountList[0]?.account.id;
						this.listSiteAPI(this.siteParams);
					}
				}
			});
		} else {
			this.listSiteAPI(this.siteParams);
		}
	}

	pageChanged(event: any): void {
		this.currentPage = event.page;
		this.updateDisplayedData();
	}

	updateDisplayedData(): void {
		const startIndex = (this.currentPage - 1) * this.perPage;
		const endIndex = startIndex + this.perPage;
		this.orderList = this.orderListResp
			.slice(startIndex, endIndex)
			.filter((item) =>
				item.name.toLowerCase().includes(this.searchInput.toLowerCase())
			);

		this.total = this.searchInput
			? this.orderList.length
			: this.orderListResp.length;
	}

	onSearch(): void {
		this.currentPage = 1;
		this.updateDisplayedData();
	}

	changeAccountData(accountId: any) {
		this.siteParams.accountId = accountId;
		this.listSiteAPI(this.siteParams);
	}

	changeSitesData(siteId: any) {
		// call list order API
	}

	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.sitesList = [...res.data.sites];
				if (this.sitesList.length) {
					//call list order API
				}
			}
		});
	}

	routeToViewMenu(orderId: number) {
		this.router.navigateByUrl(URL_ROUTES.VIEW_MENU + '/' + orderId);
	}

	openDeleteConfirmDialog(orderId: any) {
		this.dialogService.openDeleteConfirmDialog().then((result) => {
			if (result.value) {
				//call delete order API
				// this.menuService.deleteMenu(orderId).then((res: any) => {
				// 	if (res.status) {
				// 		// call list order API
				// 	}
				// });
			}
		});
	}
}
