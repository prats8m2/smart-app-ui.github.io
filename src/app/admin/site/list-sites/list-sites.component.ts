import { Component } from '@angular/core';
import { AccountService } from '../../accounts/service/account.service';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';
import { SiteService } from '../service/site.service';
import { DialogService } from 'src/app/core/services/dialog.service';

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
		private siteServices: SiteService,
		private dialogService: DialogService
	) {}

	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showAddSite: boolean = this.globalService.checkForPermission('ADD-SITE');
	showEditSite: boolean = this.globalService.checkForPermission('UPDATE-SITE');
	showViewSite: boolean = this.globalService.checkForPermission('VIEW-SITE');
	showDeleteSite: boolean =
		this.globalService.checkForPermission('DELETE-SITE');

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
					if (this.accountList.length) {
						this.siteParams.accountId = this.accountList[0]?.account?.id;
						this.listSiteAPI(this.siteParams);
					}
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
		if (this.showViewSite) {
			this.router.navigateByUrl(URL_ROUTES.VIEW_SITE + '/' + siteId);
		}
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
	openConfirmDialog(siteId: any) {
		this.dialogService.openConfirmDialog().then((result) => {
			if (result.value) {
				//call delete site API
				this.siteServices.deleteSite(siteId).then((res: any) => {
					if (res.status) {
						this.listSiteAPI(this.siteParams);
					}
				});
			}
		});
	}
}
