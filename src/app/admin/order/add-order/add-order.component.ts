import { Component, OnInit } from '@angular/core';
import { LAYOUT_VERTICAL } from 'src/app/layouts/layouts.model';
import { productList } from './products';
import { OrderService } from '../service/order.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { IParams } from 'src/app/core/interface/params';
import { RoomService } from '../../room/services/room.service';
import { TableService } from '../../table/services/table.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-add-order',
	templateUrl: './add-order.component.html',
	styleUrls: ['./add-order.component.scss'],
})
export class AddOrderComponent implements OnInit {
	isCondensed = false;
	public products = [];
	qty: number = 0;

	categoryProductList: any[] = [];
	updateCategoryProductList: any[] = [];
	roomList: any[] = [];
	tableList: any[] = [];
	searchInput: string = '';
	total: number;
	perPage: number = 10;
	currentPage: number = 1;
	selectedType: number = 1;
	selectedSiteId: string;
	selectedProductsToAdd: any[] = [];
	disableAddOrderButton: boolean = true;
	categorySelectedProducts: any[] = [];

	showListRoom = this.globalService.checkForPermission('LIST-ROOM');
	showListTable = this.globalService.checkForPermission('LIST-TABLE');
	showAddOrderButton = this.globalService.checkForPermission('ADD-ORDER');

	//form
	orderForm: FormGroup;

	roomParams: IParams = {
		siteId: null,
		limit: 100,
		pageNumber: 1,
	};

	tableParams: IParams = {
		siteId: null,
		limit: 100,
		pageNumber: 1,
	};

	productTypes = [
		{ id: 1, label: 'Food' },
		{ id: 2, label: 'Amenities' },
	];
	constructor(
		private orderService: OrderService,
		private globalService: GlobalService,
		private roomService: RoomService,
		private tableService: TableService,
		private formBuilder: FormBuilder
	) {
		document.body.setAttribute('data-bs-theme', 'dark');
		this.orderService.changeDetector.subscribe((res) => {
			if (res.isChanged) {
				this.changeDropdownData(res.siteId);
			}
		});
		this.orderService.productsDetails.subscribe((res) => {
			if (res) {
				this.selectedSiteId = res.siteId;
				this.changeDropdownData(this.selectedSiteId);
				this.categoryProductList = res.cateoryProducts;
				console.log(this.categoryProductList);
				this.createForm();
				this.updateDisplayedData();
			}
		});
	}

	createForm() {
		const formGroup = {};
		this.categoryProductList.forEach((product) => {
			formGroup[product.qty] = new FormControl(0);
		});
		this.orderForm = this.formBuilder.group(formGroup);
		console.log(this.orderForm.value);
	}

	incrementQuantity(productName: string) {
		const control = this.orderForm.get(productName);
		control.setValue(control.value + 1);
	}

	decrementQuantity(productName: string) {
		const control = this.orderForm.get(productName);
		if (control.value > 0) {
			control.setValue(control.value - 1);
		}
	}

	changeDropdownData(siteId: any) {
		this.roomParams.siteId = siteId;
		this.tableParams.siteId = siteId;
		this.listRoomAPI(this.roomParams);
		this.listTableAPI(this.tableParams);
	}

	onSettingsButtonClicked() {
		document.body.classList.toggle('right-bar-enabled');
	}

	onToggleMobileMenu() {
		this.isCondensed = !this.isCondensed;
		document.body.classList.toggle('sidebar-enable');
		document.body.classList.toggle('vertical-collpsed');

		if (window.screen.width <= 768) {
			document.body.classList.remove('vertical-collpsed');
		}
	}

	ngOnInit(): void {
		this.updateDisplayedData();
	}

	changeRoomData(roomId: any) {}

	changeTypeData(type: any) {
		this.selectedType = type;
		this.updateCategoryProductList = this.categoryProductList.filter(
			(product) => product.type == type
		);
	}

	onSearch(): void {
		this.currentPage = 1;
		this.updateDisplayedData();
	}

	updateDisplayedData(): void {
		this.updateCategoryProductList = this.categoryProductList.filter(
			(item) =>
				item.name.toLowerCase().includes(this.searchInput.toLowerCase()) &&
				item.type === this.selectedType
		);
	}

	listRoomAPI(params: IParams) {
		this.roomService.listRooms(params).subscribe((res) => {
			if (res.status) {
				this.roomList = [...res.data.rooms];
			}
		});
	}

	listTableAPI(params: IParams) {
		this.tableService.listTable(params).subscribe((res) => {
			if (res.status) {
				this.tableList = [...res.data.tables];
			}
		});
	}

	calculateQty(id: any, qty: any, i: any, productId: any) {
		if (id == '0' && qty >= 1) {
			//removing the products
			qty--;
			this.updateCategoryProductList[i].qty = qty;
			if (qty == 0) {
				this.removeCategorySelectedProducts(productId);
			}
		}
		if (id == '1' && qty < 10) {
			//maximun 10 products added
			//adding the products
			qty++;
			this.updateCategoryProductList[i].qty = qty;
			this.addCategorySelectedProducts();
		}
		this.disableAddOrderButton = !this.updateCategoryProductList.some(
			(e) => e.qty > 0
		);
	}

	createorder() {
		// const output = this.selectedProductsToAdd.filter(
		// 	(obj, index, array) => index === array.findIndex((o) => o.id === obj.id)
		// );
		// console.log(output);

		console.log(this.orderForm.value);
	}

	addCategorySelectedProducts() {
		this.updateCategoryProductList.forEach((p: any) => {
			this.selectedProductsToAdd.push(p);
		});
		console.log(this.selectedProductsToAdd);
	}

	removeCategorySelectedProducts(id: any) {
		// this.categorySelectedProducts = this.updateCategoryProductList.filter(
		// 	(product: any) => product.qty > 0
		// );
		// console.log(this.categorySelectedProducts);
		this.selectedProductsToAdd = this.updateCategoryProductList.filter(
			(p) => p.id !== id
		);
		console.log(this.selectedProductsToAdd);
	}
}
