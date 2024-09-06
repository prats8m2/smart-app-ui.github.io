import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../accounts/service/account.service';
import { URL_ROUTES } from 'src/app/constants/routing';
import { Router } from '@angular/router';
import { IParams } from 'src/app/core/interface/params';
import { DialogService } from 'src/app/core/services/dialog.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { SiteService } from '../../site/service/site.service';
import { EventService } from '../service/event.service';

@Component({
	selector: 'app-list-event',
	templateUrl: './list-event.component.html',
	styleUrls: ['./list-event.component.scss'],
})
export class ListEventComponent implements OnInit {
	constructor(
		public accountService: AccountService,
		private router: Router,
		private globalService: GlobalService,
		private siteServices: SiteService,
		private eventService: EventService,
		private dialogService: DialogService
	) {}

	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showAddEvent: boolean = this.globalService.checkForPermission('ADD-EVENT');
	showEditEvent: boolean =
		this.globalService.checkForPermission('UPDATE-EVENT');
	showViewEvent: boolean = this.globalService.checkForPermission('VIEW-EVENT');
	showDeleteEvent: boolean =
		this.globalService.checkForPermission('DELETE-EVENT');

	accountParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};
	siteParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};

	eventParams: IParams = {
		siteId: null,
		limit: 100,
		pageNumber: 1,
	};

	accountList: any = [];

	eventListResp: any = [];
	eventList: any[] = [];
	sitesList: any[] = [];
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
						this.siteParams.accountId = this.accountList[0]?.account?.id;
						this.listSiteAPI(this.siteParams);
					}
				}
			});
		} else {
			this.listSiteAPI(this.siteParams);
		}
	}

	changeAccountData(accountId: any) {
		if (accountId) {
			this.eventListResp = [];
			this.updateDisplayedData();
			this.siteParams.accountId = accountId;
			this.listSiteAPI(this.siteParams);
		}
	}

	routeToAddEvent() {
		this.router.navigateByUrl(URL_ROUTES.ADD_EVENTS);
	}
	routeToEditEvent(eventId: number) {
		this.router.navigateByUrl(URL_ROUTES.EDIT_EVENTS + '/' + eventId);
	}
	routeToViewEvent(eventId: number) {
		if (this.showViewEvent) {
			this.router.navigateByUrl(URL_ROUTES.VIEW_EVENTS + '/' + eventId);
		}
	}

	pageChanged(event: any): void {
		this.currentPage = event.page;
		this.updateDisplayedData();
	}

	updateDisplayedData(): void {
		const startIndex = (this.currentPage - 1) * this.perPage;
		const endIndex = startIndex + this.perPage;
		this.eventList = this.eventListResp
			.slice(startIndex, endIndex)
			.filter((item) =>
				item.name.toLowerCase().includes(this.searchInput.toLowerCase())
			);

		this.total = this.searchInput
			? this.eventList.length
			: this.eventListResp.length;
	}

	onSearch(): void {
		this.currentPage = 1; // Reset to the first page when performing a new search
		this.updateDisplayedData();
	}

	changeSitesData(siteId: any) {
		if (siteId) {
			this.eventParams.siteId = siteId;
			this.listEventsAPI(this.eventParams);
		}
	}

	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.sitesList = [...res.data.sites];
				if (this.sitesList.length) {
					this.eventParams.siteId = this.sitesList[0].id;
					this.listEventsAPI(this.eventParams);
				}
			}
		});
	}

	listEventsAPI(eventParams: IParams) {
		this.eventService.listEvents(eventParams).subscribe((res) => {
			if (res.status) {
				this.eventListResp = [...res.data.events];
				this.updateDisplayedData();
			}
		});
	}
	openDeleteConfirmDialog(siteId: any) {
		this.dialogService.openDeleteConfirmDialog().then((result) => {
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
