import { Component } from '@angular/core';
import { OrderService } from '../service/order.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { IParams } from 'src/app/core/interface/params';
import { AccountService } from '../../accounts/service/account.service';
import { SiteService } from '../../site/service/site.service';

@Component({
	selector: 'app-order-header',
	templateUrl: './order-header.component.html',
	styleUrls: ['./order-header.component.scss'],
})
export class OrderHeaderComponent {
	search: string;
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	accountList: any = [];
	sitesList: any = [];
	selectedOrderType: number = 1; // Default to food
	selectedSiteId: number;

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

	ngOnInit(): void {
		document.body.setAttribute('data-bs-theme', 'dark');
		if (this.showListAccount) {
			this.listAccounts();
		} else {
			this.listSiteAPI(this.siteParams);
		}
	}

	listAccounts() {
		this.accountService.listUser(this.accountParams).subscribe((res) => {
			if (res.status) {
				this.accountList = [...res.data.users];
				console.log(this.accountList);
				if (this.accountList.length) {
					this.siteParams.accountId = this.accountList[0]?.account?.id;
					this.listSiteAPI(this.siteParams);
				}
			}
		});
	}

	changeAccountData(accountId: any) {
		if (accountId) {
			this.siteParams.accountId = accountId;
			this.listSiteAPI(this.siteParams);
		}
	}

	changeSitesData(siteId: any) {
		if (siteId) {
			this.selectedSiteId = siteId;
			this.listCategory(this.selectedSiteId);
		}
	}

	listSiteAPI(params: IParams) {
		if (this.showListSite) {
			this.siteService.listSites(params).subscribe((res) => {
				if (res.status) {
					this.sitesList = [...res.data.sites];
					if (this.sitesList.length) {
						this.selectedSiteId = this.sitesList[0].id;
						this.listCategory(this.selectedSiteId);
					}
				}
			});
		}
	}

	onOrderTypeChange(orderType: number): void {
		if (orderType) {
			this.selectedOrderType = orderType;
			if (this.sitesList.length) {
				this.listCategory(this.selectedSiteId);
			}
		}
	}

	listCategory(siteId: number) {
		if (siteId) {
			this.selectedSiteId = siteId;
			this.orderService.categoryChange.next({
				siteId: this.selectedSiteId,
				orderType: this.selectedOrderType,
				categoryType: this.selectedOrderType,
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
