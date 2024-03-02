import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { IParams } from 'src/app/core/interface/params';
import { DialogService } from 'src/app/core/services/dialog.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountService } from '../../accounts/service/account.service';
import { ProductService } from '../../product/service/product.service';
import { SiteService } from '../../site/service/site.service';
import { MenuService } from '../service/menu.service';

@Component({
	selector: 'app-list-menu',
	templateUrl: './list-menu.component.html',
	styleUrls: ['./list-menu.component.scss'],
})
export class ListMenuComponent implements OnInit {
	constructor(
		public accountService: AccountService,
		private router: Router,
		private globalService: GlobalService,
		private siteServices: SiteService,
		private menuService: MenuService,
		private dialogService: DialogService
	) {}

	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showAddMenu: boolean = this.globalService.checkForPermission('ADD-MENU');
	showViewMenu: boolean = this.globalService.checkForPermission('VIEW-MENU');
	showEditMenu: boolean = this.globalService.checkForPermission('UPDATE-MENU');
	showDeleteMenu: boolean =
		this.globalService.checkForPermission('DELETE-MENU');

	siteParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};

	accountParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};

	menuParams: IParams = {
		siteId: null,
		limit: 100,
		pageNumber: 1,
	};

	menuList: any = [];
	menuListResp: any = [];
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
		this.menuList = this.menuListResp
			.slice(startIndex, endIndex)
			.filter((item) =>
				item.name.toLowerCase().includes(this.searchInput.toLowerCase())
			);

		this.total = this.searchInput
			? this.menuList.length
			: this.menuListResp.length;
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
		this.menuParams.siteId = siteId;
		this.listMenuAPI(this.menuParams);
	}

	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.sitesList = [...res.data.sites];
				if (this.sitesList.length) {
					this.menuParams.siteId = this.sitesList[0]?.id;
					this.listMenuAPI(this.menuParams);
				}
			}
		});
	}

	listMenuAPI(params: IParams) {
		this.menuService.listMenu(params).subscribe((res) => {
			if (res.status) {
				this.menuListResp = [...res.data.menus];
				this.updateDisplayedData();
			}
		});
	}

	routeToAddMenu() {
		this.router.navigateByUrl(URL_ROUTES.ADD_MENU);
	}

	routeToViewMenu(menuId: number) {
		this.router.navigateByUrl(URL_ROUTES.VIEW_MENU + '/' + menuId);
	}

	routeToEditMenu(menuId: any) {
		this.router.navigateByUrl(URL_ROUTES.EDIT_MENU + '/' + menuId);
	}

	openDeleteConfirmDialog(menuId: any) {
		this.dialogService.openDeleteConfirmDialog().then((result) => {
			if (result.value) {
				//call delete menu API
				this.menuService.deleteMenu(menuId).then((res: any) => {
					if (res.status) {
						this.listMenuAPI(this.menuParams);
					}
				});
			}
		});
	}
}
