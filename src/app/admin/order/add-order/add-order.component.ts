import { Component, OnInit } from '@angular/core';
import { OrderService } from '../service/order.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { IParams } from 'src/app/core/interface/params';
import { RoomService } from '../../room/services/room.service';
import { TableService } from '../../table/services/table.service';
import { SiteService } from '../../site/service/site.service';

@Component({
	selector: 'app-add-order',
	templateUrl: './add-order.component.html',
	styleUrls: ['./add-order.component.scss'],
})
export class AddOrderComponent implements OnInit {
	isCondensed = false;
	public products;
	public filteredProducts;
	public order = [];

	showListRoom = this.globalService.checkForPermission('LIST-ROOM');
	showListTable = this.globalService.checkForPermission('LIST-TABLE');
	showAddOrderButton = this.globalService.checkForPermission('ADD-ORDER');
	rooms: any = [];
	tables: any = [];
	selectedRoom: number;
	selectedTable: number;
	selectedSite: number;
	selectedType: number;
	totalAmountOfProduct: number = 0;
	currency: string = '';
	showRoomDropdown: boolean = true;
	showTableDropdown: boolean = false;
	disableSaveButton: boolean = true;
	categoryType: number = 1;
	siteDetails: any;
	siteSettings: any;
	pricing: any;

	sgstAmount: number = 0;
	cgstAmount: number = 0;
	serviceTaxAmount: number = 0;
	totalAmountWithTaxes: number = 0;

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
		private siteService: SiteService
	) {
		document.body.setAttribute('data-bs-theme', 'dark');
		this.orderService.productsDetails.subscribe(async (res) => {
			if (res) {
				this.products = res.products;
				this.filteredProducts = this.products;
				this.categoryType = res.categoryType;
				// clear orders
				this.order = [];
				if (this.selectedSite !== res.siteId) {
					//list rooms and tables
					if (this.showListRoom) {
						this.listRooms(res.siteId);
					}
				}
				this.selectedSite = res.siteId;
				const siteResponse = await this.siteService.viewSite(res.siteId);
				this.siteDetails = siteResponse.data;
				this.currency = this.siteDetails.settings.currency;
			}
		});

		this.orderService.productsChange.subscribe((res) => {
			if (res) {
				switch (res.action) {
					case 1:
						{
							const searchTerm = res.data;
							if (searchTerm) {
								this.filteredProducts = this.products.filter((product) =>
									product.name.toLowerCase().includes(searchTerm.toLowerCase())
								);
							} else {
								this.filteredProducts = this.products;
							}
						}
						break;
				}
			}
		});
	}

	calculatePrice() {
		this.siteSettings = this.siteDetails.settings;
		this.sgstAmount =
			(this.totalAmountOfProduct * this.siteSettings.sgst) / 100;
		this.cgstAmount =
			(this.totalAmountOfProduct * this.siteSettings.cgst) / 100;
		this.serviceTaxAmount =
			(this.totalAmountOfProduct * this.siteSettings.serviceTax) / 100;
		this.totalAmountWithTaxes = Number(
			(
				this.totalAmountOfProduct +
				this.sgstAmount +
				this.cgstAmount +
				this.serviceTaxAmount
			).toFixed(2)
		);

		this.pricing = {
			totalAmountOfProduct: Number(this.totalAmountOfProduct.toFixed(2)),
			sgstAmount: Number(this.sgstAmount.toFixed(2)),
			cgstAmount: Number(this.cgstAmount.toFixed(2)),
			serviceTaxAmount: Number(this.serviceTaxAmount.toFixed(2)),
			totalAmountWithTaxes: Number(this.totalAmountWithTaxes.toFixed(2)),
		};
	}

	addProductToOrder(product) {
		const existingProduct = this.order.find((item) => item.id === product.id);
		if (!existingProduct) {
			const productOrder = {
				id: product.id,
				quantity: 1,
				price: product.price,
				name: product.name,
				total: product.price,
			};
			this.order.push(productOrder);
			this.totalAmountOfProduct += product.price;
			this.calculatePrice();
		} else {
		}
	}

	isAddedinOrder(id) {
		return this.order.find((item) => item.id === id);
	}

	calculateQty(operation: string, currentQty: number, index: number): void {
		if (operation === '1') {
			this.order[index].quantity += 1;
			this.totalAmountOfProduct += this.order[index].price;
		} else if (operation === '0' && this.order[index]?.quantity > 0) {
			this.order[index].quantity -= 1;
			this.totalAmountOfProduct -= this.order[index].price;
			if (this.order[index]?.quantity == 0) {
				this.delete(index);
			}
		}
		if (this.order[index]) {
			this.order[index].total =
				this.order[index]?.quantity * this.order[index]?.price;
		}
		this.calculatePrice();
	}

	delete(index): void {
		if (index !== -1) {
			this.totalAmountOfProduct =
				this.totalAmountOfProduct -
				this.order[index].price * this.order[index].quantity;
			this.order.splice(index, 1);
			this.calculatePrice();
		}
	}

	async listRooms(siteId) {
		if (siteId) {
			this.roomParams.siteId = siteId;
			const res = await this.roomService.listRoomsPromise(this.roomParams);
			if (res.status) {
				this.rooms = [...res.data.rooms];
			} else {
				return null;
			}
		}
	}

	async listTables(siteId) {
		if (siteId) {
			this.tableParams.siteId = siteId;
			const res = await this.tableService.listTablePromise(this.tableParams);
			if (res.status) {
				this.tables = [...res.data.tables];
			} else {
				return null;
			}
		}
	}

	updateRoom(selectedRoomId: number): void {
		if (selectedRoomId) {
			this.selectedRoom = selectedRoomId;
			this.selectedTable = 0;
			this.disableSaveButton = false;
			this.selectedType = 2;
		}
	}

	updateTable(selectedTableId: number): void {
		if (selectedTableId) {
			this.selectedTable = selectedTableId;
			this.selectedRoom = 0;
			this.disableSaveButton = false;
			this.selectedType = 1;
		}
	}

	ngOnInit(): void {}

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

	onChangeRadio(value: number) {
		this.disableSaveButton = true;
		if (value == 1 && this.showListRoom) {
			this.listRooms(this.selectedSite);
		}
		if (value == 2 && this.showListTable) {
			this.listTables(this.selectedSite);
		}
		this.showRoomDropdown = value === 1;
		this.showTableDropdown = !this.showRoomDropdown;
	}

	resetData() {
		this.order = null;
		this.totalAmountOfProduct = 0;
		this.showRoomDropdown = true;
		this.showTableDropdown = false;
	}

	addOrder() {
		//create order API
		this.orderService
			.addOrder(
				this.selectedType,
				this.categoryType,
				this.selectedTable,
				this.selectedRoom,
				this.selectedSite,
				this.order
			)
			.then((res) => {
				if (res.status) {
					window.location.reload();
				} else {
					console.log('error');
				}
			});
	}
}
