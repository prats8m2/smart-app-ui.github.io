import { Component } from '@angular/core';
import { AccountService } from '../../accounts/service/account.service';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';
import { APP_ROLE } from 'src/app/constants/core';
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

	sitesList: any = [];
	sitesListResp: any = [];
	total: number;
	perPage: number = 10;
	currentPage: number = 1;
	searchInput: string = '';
	userRole: string;

	GG = [
		{ id: 1, name: 'Site 1' },
		{ id: 2, name: 'Site 2' },
		{ id: 3, name: 'Site 3' },
		// Add more sites as needed
	];

	userParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};

	siteParams: IParams;

	ngOnInit(): void {
		this.userRole = this.globalService.getUserRole('userRole');
		if (this.userRole === APP_ROLE.SUPER_ADMIN) {
			this.siteParams = {
				accountId: 1,
				limit: 100,
				pageNumber: 1,
			};
			this.listSiteAPI(this.siteParams);
		} else {
			this.siteParams = {
				accountId: null,
				limit: 100,
				pageNumber: 1,
			};
			this.listSiteAPI(this.siteParams);
		}
	}

	listSiteAPI(param: IParams) {
		this.siteServices.listSites(this.siteParams).subscribe((res) => {
			if (res.status) {
				this.sitesListResp = [...res.data.users];
				this.total = this.sitesListResp.length;
				this.updateDisplayedData();
			}
		});
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
		this.sitesList = this.sitesListResp
			.slice(startIndex, endIndex)
			.filter(
				(item) =>
					item.name.toLowerCase().includes(this.searchInput.toLowerCase()) ||
					item.address.toLowerCase().includes(this.searchInput.toLowerCase())
			);

		this.total = this.searchInput
			? this.sitesList.length
			: this.sitesListResp.length;
	}

	onSearch(): void {
		this.currentPage = 1; // Reset to the first page when performing a new search
		this.updateDisplayedData();
	}

	changeAccountValue(value: any) {
		console.log(value);
	}
}
