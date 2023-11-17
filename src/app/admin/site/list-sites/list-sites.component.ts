import { Component } from '@angular/core';
import { AccountService } from '../../accounts/service/account.service';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';
import { SiteService } from '../service/site.service';

@Component({
	selector: 'app-list-sites',
	templateUrl: './list-sites.component.html',
	styleUrls: ['./list-sites.component.scss'],
})
export class ListSitesComponent {
	constructor(
		public accountService: AccountService,
		private router: Router,
		private globalService: GlobalService,
		private siteServices: SiteService
	) {}

	showListAccount: boolean = this.globalService.checkForPermission('LIST-USER');
	showAddSite: boolean = this.globalService.checkForPermission('ADD-SITE');

	accountParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};

	accountList: any = [];
	siteList: any = [];

	sitesListResp: any = [];
	total: number;
	perPage: number = 10;
	currentPage: number = 1;
	searchInput: string = '';
	userRole: string;
	siteParams: IParams = {
		accountId: null,
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

	routeToAddSite() {
		this.router.navigateByUrl(URL_ROUTES.ADD_SITE);
	}
	routeToEditSite(siteId: number) {
		this.router.navigateByUrl(URL_ROUTES.EDIT_SITE + '/' + siteId);
	}
	routeToViewSite(siteId: number) {
		this.router.navigateByUrl(URL_ROUTES.VIEW_SITE + '/' + siteId);
	}

	pageChanged(event: any): void {
		this.currentPage = event.page;
		this.updateDisplayedData();
	}

	updateDisplayedData(): void {
		const startIndex = (this.currentPage - 1) * this.perPage;
		const endIndex = startIndex + this.perPage;
		this.siteList = this.sitesListResp
			.slice(startIndex, endIndex)
			.filter(
				(item) =>
					item.name.toLowerCase().includes(this.searchInput.toLowerCase()) ||
					item.address.toLowerCase().includes(this.searchInput.toLowerCase())
			);

		this.total = this.searchInput
			? this.siteList.length
			: this.sitesListResp.length;
	}

	onSearch(): void {
		this.currentPage = 1; // Reset to the first page when performing a new search
		this.updateDisplayedData();
	}

	changeSitesData(accountId: any) {
		this.siteParams.accountId = accountId;
		this.listSiteAPI(this.siteParams);
	}

	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.sitesListResp = [...res.data.sites];
				this.updateDisplayedData();
			}
		});
	}
}
