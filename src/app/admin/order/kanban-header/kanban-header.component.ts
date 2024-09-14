import { Component } from '@angular/core';
import { OrderService } from '../service/order.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { IParams } from 'src/app/core/interface/params';
import { AccountService } from '../../accounts/service/account.service';
import { SiteService } from '../../site/service/site.service';
@Component({
	selector: 'app-kanban-header',
	templateUrl: './kanban-header.component.html',
	styleUrls: ['./kanban-header.component.scss'],
})
export class KanbanHeaderComponent {
	search: string;
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	accountList: any = [];
	sitesList: any = [];
	selectedOrderType: number = 1;
	selectedSiteId: number;
	selectedAccountId: number;

	accountParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};

	siteParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};
	constructor(
		private orderService: OrderService,
		private globalService: GlobalService,
		private accountService: AccountService,
		private siteService: SiteService
	) {
		document.body.setAttribute('data-bs-theme', 'dark');
	}

	ngOnInit() {
		document.body.setAttribute('data-bs-theme', 'dark');

		if (this.showListAccount) {
			this.listAccountsAPI();
		} else {
			this.listSiteAPI(null);
		}
	}

	listAccountsAPI() {
		this.accountService.listUser(this.accountParams).subscribe((res) => {
			if (res.status) {
				this.accountList = [...res.data.users];
				if (this.accountList.length) {
					this.siteParams.accountId = this.accountList[0]?.account?.id;
					this.selectedAccountId = this.accountList[0]?.account?.id;
					this.listSiteAPI(this.siteParams);
				}
			}
		});
	}

	changeSitesData(accountId: any) {
		if (accountId) {
			this.siteParams.accountId = accountId;
			this.listSiteAPI(this.siteParams);
		}
	}

	listSiteAPI(params: IParams) {
		this.siteService.listSites(params).subscribe((res) => {
			if (res.status) {
				this.sitesList = [...res.data.sites];
				if (this.sitesList.length) {
					this.selectedSiteId = this.sitesList[0]?.id;
					this.listOrders(this.selectedSiteId, this.selectedOrderType);
				}
			}
		});
	}

	onOrderTypeChange(orderType: number): void {
		this.selectedOrderType = orderType;
		this.listOrders(this.selectedSiteId, this.selectedOrderType);
	}

	listOrders(siteId: number, orderType: number) {
		if (siteId) {
			this.selectedSiteId = siteId;
			this.orderService.ordersChange.next({
				accountId: this.selectedAccountId,
				siteId: this.selectedSiteId,
				orderType: orderType || this.selectedOrderType,
			});
		}
	}

	onSearch() {
		this.orderService.productsChange.next({
			data: this.search,
			action: 1,
		});
	}
}
