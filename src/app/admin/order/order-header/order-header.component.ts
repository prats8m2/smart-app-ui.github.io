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
	constructor(
		private orderService: OrderService,
		private globalService: GlobalService,
		private accountService: AccountService,
		private siteService: SiteService
	) {
		document.body.setAttribute('data-bs-theme', 'dark');
	}

	async ngOnInit() {
		document.body.setAttribute('data-bs-theme', 'dark');
		// this.orderService.productsDetails.next(null);
		//check for account permission
		if (this.showListAccount) {
			this.accountList = await this.listAccounts();
			if (this.accountList?.length) {
				await this.listSites(this.accountList[0]);
			}
		} else {
			await this.listSites(null);
		}
	}

	async listAccounts() {
		const accountParams: IParams = {
			limit: 100,
			pageNumber: 1,
		};
		const res = await this.accountService.listAccounts(accountParams);
		if (res.status) {
			return res.data.accounts;
		} else {
			return null;
		}
	}

	async listSites(account) {
		const siteParams: IParams = {
			limit: 100,
			pageNumber: 1,
			accountId: account?.id,
		};
		const res = await this.siteService.listSitesPromise(siteParams);
		if (res.status) {
			this.sitesList = res.data.sites;
      		this.selectedSiteId = this.sitesList[0].id;
			this.listCategory(this.selectedSiteId);
		} else {
			return null;
		}
	}

	onOrderTypeChange(orderType: number): void {
		this.selectedOrderType = orderType;
		console.log('Selected Order Type:', this.selectedOrderType);
		this.listCategory(null)
	}

	listCategory(siteId) {
    if(siteId)  this.selectedSiteId = siteId
		this.orderService.categoryChange.next({
			siteId: this.selectedSiteId,
			orderType: this.selectedOrderType,
		});
	}

	onSearch() {
		this.orderService.productsChange.next({
			data: this.search,
			action: 1,
		});
	}
}
