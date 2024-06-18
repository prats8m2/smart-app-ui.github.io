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
export class OrderSidebarComponent implements AfterViewInit {
	@ViewChild('componentRef') scrollRef;
	@Input() isCondensed = false;
	permissions: any;
	categoryList: any = [];

	productTypes = [
		{ id: 1, label: 'Food' },
		{ id: 2, label: 'Amenities' },
	];

	categoryParams: IParams = {
		siteId: null,
		type: 1,
		limit: 100,
		pageNumber: 1,
	};

	@ViewChild('sideMenu') sideMenu: ElementRef;

	constructor(
		private router: Router,
		private categoryService: CategoryService,
		private orderService: OrderService
	) {
		document.body.setAttribute('data-sidebar', 'dark');
		this.orderService.categoryChange.subscribe((res) => {
			if (res) {
				this.listCategory(res.siteId, res.orderType);
			}
		});
	}

	async listCategory(siteId, type) {
		this.categoryParams.siteId = siteId;
		this.categoryParams.type = type;
		const res = await this.categoryService.listCategoryPromise(
			this.categoryParams
		);
		if (res.status) {
			this.categoryList = res.data.categories;
			if (this.categoryList[0] && this.categoryList[0].products)
				this.listProducts(this.categoryList[0].products);
			else{
				this.listProducts([]);
			}
		}
	}

	listProducts(products: any) {
		this.orderService.productsDetails.next({
			products,
			siteId: this.categoryParams.siteId,
		});
	}
	ngAfterViewInit() {
		// this.menu = new MetisMenu(this.sideMenu.nativeElement);
	}
}
