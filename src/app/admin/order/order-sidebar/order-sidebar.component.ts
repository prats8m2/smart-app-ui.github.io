import {
	AfterViewInit,
	Component,
	ElementRef,
	Input,
	ViewChild,
} from '@angular/core';
import { IParams } from 'src/app/core/interface/params';
import { CategoryService } from '../../category/service/category.service';
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
	selectedCategoryType: number;

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
		private categoryService: CategoryService,
		private orderService: OrderService
	) {
		document.body.setAttribute('data-sidebar', 'dark');
		this.orderService.categoryChange.subscribe((res) => {
			if (res) {
				this.listCategory(res.siteId, res.orderType);
				this.selectedCategoryType = res.categoryType;
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
			if (this.categoryList.length)
				this.listProducts(this.categoryList[0]?.products);
			else {
				this.listProducts([]);
			}
		}
	}

	listProducts(products: any) {
		this.orderService.productsDetails.next({
			products,
			siteId: this.categoryParams.siteId,
			categoryType: this.selectedCategoryType,
		});
	}
	ngAfterViewInit() {
		// this.menu = new MetisMenu(this.sideMenu.nativeElement);
	}
}
