import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { IParams } from 'src/app/core/interface/params';
import { DialogService } from 'src/app/core/services/dialog.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountService } from '../../accounts/service/account.service';
import { SiteService } from '../../site/service/site.service';
import { CategoryService } from '../service/category.service';

@Component({
	selector: 'app-list-category',
	templateUrl: './list-category.component.html',
	styleUrls: ['./list-category.component.scss'],
})
export class ListCategoryComponent implements OnInit {
	sitesList: any = [];
	constructor(
		public accountService: AccountService,
		private router: Router,
		private globalService: GlobalService,
		private siteServices: SiteService,
		private categoryService: CategoryService,
		private dialogService: DialogService
	) {}

	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showAddCategory: boolean =
		this.globalService.checkForPermission('ADD-CATEGORY');
	showViewDevice: boolean =
		this.globalService.checkForPermission('VIEW-CATEGORY');

	showEditCategory: boolean =
		this.globalService.checkForPermission('UPDATE-CATEGORY');
	showDeleteCategory: boolean =
		this.globalService.checkForPermission('DELETE-CATEGORY');

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
	categoryList: any = [];

	categoryListResp: any = [];
	total: number;
	perPage: number = 10;
	currentPage: number = 1;
	searchInput: string = '';
	categoryParams: IParams = {
		siteId: null,
		type: 1,
		limit: 100,
		pageNumber: 1,
	};

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

	routeToAddCategory() {
		this.router.navigateByUrl(URL_ROUTES.ADD_CATEGORY);
	}

	routeToEditCategory(categoryId: any) {
		this.router.navigateByUrl(URL_ROUTES.EDIT_CATEGORY + '/' + categoryId);
	}
	routeToViewCategory(categoryId: any) {
		if (this.showViewDevice) {
			this.router.navigateByUrl(URL_ROUTES.VIEW_CATEGORY + '/' + categoryId);
		}
	}

	pageChanged(event: any): void {
		this.currentPage = event.page;
		this.updateDisplayedData();
	}

	updateDisplayedData(): void {
		const startIndex = (this.currentPage - 1) * this.perPage;
		const endIndex = startIndex + this.perPage;
		this.categoryList = this.categoryListResp
			.slice(startIndex, endIndex)
			.filter((item) =>
				item.name.toLowerCase().includes(this.searchInput.toLowerCase())
			);

		this.total = this.searchInput
			? this.categoryList.length
			: this.categoryListResp.length;
	}

	onSearch(): void {
		this.currentPage = 1;
		this.updateDisplayedData();
	}

	changeAccountData(accountId: any) {
		this.categoryListResp = [];
		this.updateDisplayedData();
		this.siteParams.accountId = accountId;
		this.listSiteAPI(this.siteParams);
	}

	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.sitesList = [...res.data.sites];
				if (this.sitesList.length) {
					this.categoryParams.siteId = this.sitesList[0]?.id;
					this.listCategoryAPI(this.categoryParams);
				}
			}
		});
	}
	changeSitesData(siteId: any) {
		this.categoryParams.siteId = siteId;
		this.listCategoryAPI(this.categoryParams);
	}

	listCategoryAPI(params: IParams) {
		this.categoryService.listCategory(params).subscribe((res) => {
			if (res.status) {
				this.categoryListResp = [...res.data.categories];
				this.updateDisplayedData();
			}
		});
	}

	openDeleteConfirmDialog(categoryId: any) {
		this.dialogService.openDeleteConfirmDialog().then((result) => {
			if (result.value) {
				//call delete device API
				this.categoryService.deleteCategory(categoryId).then((res: any) => {
					if (res.status) {
						this.listCategoryAPI(this.categoryParams);
					}
				});
			}
		});
	}

	changeCategoryType(type: any) {
		this.categoryParams.type = type;
		this.listCategoryAPI(this.categoryParams);
	}
}
