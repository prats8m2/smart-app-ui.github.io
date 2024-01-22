import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountService } from '../../accounts/service/account.service';
import { SiteService } from '../../site/service/site.service';
import { ProductService } from '../service/product.service';

@Component({
	selector: 'app-list-product',
	templateUrl: './list-product.component.html',
	styleUrls: ['./list-product.component.scss'],
})
export class ListProductComponent implements OnInit {
	constructor(
		public accountService: AccountService,
		private router: Router,
		private globalService: GlobalService,
		private siteServices: SiteService,
		private productService: ProductService
	) {}

	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showAddProduct: boolean =
		this.globalService.checkForPermission('ADD-PRODUCT');
	showViewProduct: boolean =
		this.globalService.checkForPermission('VIEW-PRODUCT');
	showEditProduct: boolean =
		this.globalService.checkForPermission('UPDATE-PRODUCT');
	showDeleteProduct: boolean =
		this.globalService.checkForPermission('DELETE-PRODUCT');

	siteParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};

	accountParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};

	productParams: IParams = {
		siteId: null,
		limit: 100,
		pageNumber: 1,
	};

	productList: any = [];
	productListResp: any = [];
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
		this.productList = this.productListResp
			.slice(startIndex, endIndex)
			.filter((item) =>
				item.name.toLowerCase().includes(this.searchInput.toLowerCase())
			);

		this.total = this.searchInput
			? this.productList.length
			: this.productListResp.length;
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
		this.productParams.siteId = siteId;
		this.listProductsAPI(this.productParams);
	}

	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.sitesList = [...res.data.sites];
				if (this.sitesList.length) {
					this.productParams.siteId = this.sitesList[0]?.id;
					this.listProductsAPI(this.productParams);
				}
			}
		});
	}

	listProductsAPI(params: IParams) {
		this.productService.listProduct(params).subscribe((res) => {
			if (res.status) {
				this.productListResp = [...res.data.products];
				this.updateDisplayedData();
			}
		});
	}

	routeToAddProduct() {
		this.router.navigateByUrl(URL_ROUTES.ADD_PRODUCT);
	}

	routeToViewProduct(productId: number) {
		this.router.navigateByUrl(URL_ROUTES.VIEW_PRODUCT + '/' + productId);
	}

	routeToEditProduct(productId: any) {
		this.router.navigateByUrl(URL_ROUTES.EDIT_PRODUCT + '/' + productId);
	}

	openConfirmDialog(productId: any) {}
}
