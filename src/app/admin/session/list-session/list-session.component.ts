import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { IParams } from 'src/app/core/interface/params';
import { DialogService } from 'src/app/core/services/dialog.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountService } from '../../accounts/service/account.service';
import { CategoryService } from '../../category/service/category.service';
import { SiteService } from '../../site/service/site.service';
import { SessionService } from '../services/session.service';

@Component({
	selector: 'app-list-session',
	templateUrl: './list-session.component.html',
	styleUrls: ['./list-session.component.scss'],
})
export class ListSessionComponent implements OnInit {
	sitesList: any = [];
	constructor(
		public accountService: AccountService,
		private router: Router,
		private globalService: GlobalService,
		private siteServices: SiteService,
		private sessionService: SessionService,
		private dialogService: DialogService
	) {}

	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showTerminateSession: boolean =
		this.globalService.checkForPermission('TERMINATE-SESSION');

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
	sessionList: any = [];

	sessionListResp: any = [];
	total: number;
	perPage: number = 10;
	currentPage: number = 1;
	searchInput: string = '';
	sessionParams: IParams = {
		siteId: null,
		type: 1,
		pageNumber: 1,
		limit: 100,
	};

	selectedSessionType: number = 1;

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
		this.sessionList = this.sessionListResp
			.slice(startIndex, endIndex)
			.filter((item) =>
				item.sessionId.toLowerCase().includes(this.searchInput.toLowerCase())
			);

		this.total = this.searchInput
			? this.sessionList.length
			: this.sessionListResp.length;
	}

	onSearch(): void {
		this.currentPage = 1;
		this.updateDisplayedData();
	}

	changeAccountData(accountId: any) {
		if (accountId) {
			this.sessionListResp = [];
			this.updateDisplayedData();
			this.siteParams.accountId = accountId;
			this.listSiteAPI(this.siteParams);
		}
	}

	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.sitesList = [...res.data.sites];
				if (this.sitesList.length) {
					this.sessionParams.siteId = this.sitesList[0]?.id;
					this.listSessionAPI(this.sessionParams);
				}
			}
		});
	}
	changeSitesData(siteId: any) {
		if (siteId) {
			this.sessionParams.siteId = siteId;
			this.listSessionAPI(this.sessionParams);
		}
	}

	listSessionAPI(params: IParams) {
		this.sessionService.listSessions(params).subscribe((res) => {
			if (res.status) {
				this.sessionListResp = [...res.data.sessions];
				this.selectedSessionType = res?.data?.type;
				this.updateDisplayedData();
			}
		});
	}

	openDeleteConfirmDialog(sessionId: any) {
		if (sessionId) {
			this.dialogService.openDeleteConfirmDialog().then((result) => {
				if (result.value) {
					//call delete device API
					this.sessionService.terminateSession(sessionId).then((res: any) => {
						if (res.status) {
							this.listSessionAPI(this.sessionParams);
						}
					});
				}
			});
		}
	}

	changeSesionType(type: any) {
		if (type) {
			this.sessionParams.type = type;
			this.listSessionAPI(this.sessionParams);
		}
	}

	refreshSessions() {
		this.listSessionAPI(this.sessionParams);
	}
}
