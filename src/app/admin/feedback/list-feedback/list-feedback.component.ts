import { Component, OnInit } from '@angular/core';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountService } from '../../accounts/service/account.service';
import { SiteService } from '../../site/service/site.service';
import { FeedbackService } from '../service/feedback.service';

@Component({
	selector: 'app-list-feedback',
	templateUrl: './list-feedback.component.html',
	styleUrls: ['./list-feedback.component.scss'],
})
export class ListFeedbackComponent implements OnInit {
	constructor(
		public accountService: AccountService,
		private globalService: GlobalService,
		private siteServices: SiteService,
		private feedbackService: FeedbackService
	) {}

	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');

	siteParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};

	accountParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};

	feedbackParams: IParams = {
		siteId: null,
		limit: 100,
		pageNumber: 1,
	};

	feedbackList: any = [];
	feedbackListResp: any = [];
	sitesList: any = [];
	readonly: boolean = true;
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
		this.feedbackList = this.feedbackListResp
			.slice(startIndex, endIndex)
			.filter((item) =>
				item.name.toLowerCase().includes(this.searchInput.toLowerCase())
			);

		this.total = this.searchInput
			? this.feedbackList.length
			: this.feedbackListResp.length;
	}

	changeAccountData(accountId: any) {
		if (accountId) {
			this.siteParams.accountId = accountId;
			this.listSiteAPI(this.siteParams);
		}
	}

	changeSitesData(siteId: any) {
		if (siteId) {
			this.feedbackParams.siteId = siteId;
			this.listFeedbackAPI(this.feedbackParams);
		}
	}

	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.sitesList = [...res.data.sites];
				if (this.sitesList.length) {
					this.feedbackParams.siteId = this.sitesList[0]?.id;
					this.listFeedbackAPI(this.feedbackParams);
				}
			}
		});
	}

	listFeedbackAPI(params: IParams) {
		this.feedbackService.listFeedback(params).subscribe((res) => {
			if (res.status) {
				this.feedbackListResp = [...res.data.feedbacks];
				this.updateDisplayedData();
			}
		});
	}
}
