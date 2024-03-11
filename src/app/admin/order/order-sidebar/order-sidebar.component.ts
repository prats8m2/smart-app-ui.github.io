import {
	AfterViewInit,
	Component,
	ElementRef,
	Input,
	OnChanges,
	OnInit,
	ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import MetisMenu from 'metismenujs';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';
import { MenuItem } from 'src/app/layouts/sidebar/menu.model';
import { AccountService } from '../../accounts/service/account.service';
import { CategoryService } from '../../category/service/category.service';
import { SiteService } from '../../site/service/site.service';
import { OrderService } from '../service/order.service';

@Component({
	selector: 'app-order-sidebar',
	templateUrl: './order-sidebar.component.html',
	styleUrls: ['./order-sidebar.component.scss'],
})
export class OrderSidebarComponent implements OnInit, AfterViewInit, OnChanges {
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	@ViewChild('componentRef') scrollRef;
	@Input() isCondensed = false;
	menu: any;
	data: any;
	permissions: any;
	selectedMenuItem: MenuItem;
	accountList: any = [];
	sitesList: any = [];
	categoryList: any = [];

	menuItems = [];
	productTypes = [
		{ id: 1, label: 'Food' },
		{ id: 2, label: 'Amenities' },
	];

	siteParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};
	accountParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};
	categoryParams: IParams = {
		siteId: null,
		limit: 100,
		pageNumber: 1,
	};

	@ViewChild('sideMenu') sideMenu: ElementRef;

	constructor(
		private router: Router,
		private globalService: GlobalService,
		private siteServices: SiteService,
		private accountService: AccountService,
		private categoryService: CategoryService,
		private orderService: OrderService
	) {
		document.body.setAttribute('data-sidebar', 'dark');
		router.events.forEach((event) => {
			if (event instanceof NavigationEnd) {
				this._activateMenuDropdown();
				this._scrollElement();
			}
		});
	}

	ngOnInit() {
		document.body.setAttribute('data-bs-theme', 'dark');
		this.orderService.productsDetails.next(null);
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

	ngAfterViewInit() {
		this.menu = new MetisMenu(this.sideMenu.nativeElement);
		this._activateMenuDropdown();
	}

	toggleMenu(event) {
		event.currentTarget.nextElementSibling.classList.toggle('mm-show');
	}

	ngOnChanges() {
		if ((!this.isCondensed && this.sideMenu) || this.isCondensed) {
			setTimeout(() => {
				this.menu = new MetisMenu(this.sideMenu.nativeElement);
			});
		} else if (this.menu) {
			this.menu.dispose();
		}
	}
	_scrollElement() {
		setTimeout(() => {
			if (document.getElementsByClassName('mm-active').length > 0) {
				const currentPosition =
					document.getElementsByClassName('mm-active')[0]['offsetTop'];
				if (currentPosition > 500)
					if (this.scrollRef.SimpleBar !== null)
						this.scrollRef.SimpleBar.getScrollElement().scrollTop =
							currentPosition + 300;
			}
		}, 300);
	}

	_removeAllClass(className) {
		const els = document.getElementsByClassName(className);
		while (els[0]) {
			els[0].classList.remove(className);
		}
	}

	_activateMenuDropdown() {
		this._removeAllClass('mm-active');
		this._removeAllClass('mm-show');
		const links = document.getElementsByClassName('side-nav-link-ref');
		let menuItemEl = null;

		const paths = [];
		for (let i = 0; i < links.length; i++) {
			paths.push(links[i]['pathname']);
		}
		var itemIndex = paths.indexOf(window.location.pathname);
		if (itemIndex === -1) {
			const strIndex = window.location.pathname.lastIndexOf('/');
			const item = window.location.pathname.substr(0, strIndex).toString();
			menuItemEl = links[paths.indexOf(item)];
		} else {
			menuItemEl = links[itemIndex];
		}
		if (menuItemEl) {
			menuItemEl.classList.add('active');
			const parentEl = menuItemEl.parentElement;
			if (parentEl) {
				parentEl.classList.add('mm-active');
				const parent2El = parentEl.parentElement.closest('ul');
				if (parent2El && parent2El.id !== 'side-menu') {
					parent2El.classList.add('mm-show');
					const parent3El = parent2El.parentElement;
					if (parent3El && parent3El.id !== 'side-menu') {
						parent3El.classList.add('mm-active');
						const childAnchor = parent3El.querySelector('.has-arrow');
						const childDropdown = parent3El.querySelector('.has-dropdown');
						if (childAnchor) {
							childAnchor.classList.add('mm-active');
						}
						if (childDropdown) {
							childDropdown.classList.add('mm-active');
						}
						const parent4El = parent3El.parentElement;
						if (parent4El && parent4El.id !== 'side-menu') {
							parent4El.classList.add('mm-show');
							const parent5El = parent4El.parentElement;
							if (parent5El && parent5El.id !== 'side-menu') {
								parent5El.classList.add('mm-active');
								const childanchor = parent5El.querySelector('.is-parent');
								if (childanchor && parent5El.id !== 'side-menu') {
									childanchor.classList.add('mm-active');
								}
							}
						}
					}
				}
			}
		}
	}

	hasItems(item: MenuItem) {
		return item.subItems !== undefined ? item.subItems.length > 0 : false;
	}

	changeAccountData(accountId: any) {
		this.menuItems = [];
		this.siteParams.accountId = accountId;
		this.listSiteAPI(this.siteParams);
	}

	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.sitesList = [...res.data.sites];
				if (this.sitesList.length) {
					this.categoryParams.siteId = this.sitesList[0].id;
					this.listCategoryAPI(this.categoryParams);
				}
			}
		});
	}

	changeSitesData(siteId: any) {
		this.menuItems = [];
		this.categoryParams.siteId = siteId;
		this.listCategoryAPI(this.categoryParams);
	}

	listCategoryAPI(params: IParams) {
		this.categoryService.listCategory(params).subscribe((res) => {
			if (res.status) {
				this.categoryList = [...res.data.categories];

				if (this.categoryList.length) {
					this.initialize(this.categoryList);
				}
			}
		});
	}

	initialize(categories: any): void {
		categories.forEach((item: any) => {
			this.menuItems.push({
				id: item.id,
				label: item.name,
				products: item.products,
			});
		});
	}

	changeCategoryData(cateoryProducts: any) {
		console.log(cateoryProducts);
		this.orderService.productsDetails.next(cateoryProducts);
	}
}
