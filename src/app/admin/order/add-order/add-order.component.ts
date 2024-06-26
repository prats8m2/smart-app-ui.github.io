import { Component, OnInit } from '@angular/core';
import { OrderService } from '../service/order.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { IParams } from 'src/app/core/interface/params';
import { RoomService } from '../../room/services/room.service';
import { TableService } from '../../table/services/table.service';

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
	showRoomDropdown: boolean = true;
	showTableDropdown: boolean = false;
	disableSaveButton: boolean = true;

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
		private tableService: TableService
	) {
		document.body.setAttribute('data-bs-theme', 'dark');

		this.orderService.productsDetails.subscribe((res) => {
			if (res) {
				this.products = res.products;
				this.filteredProducts = this.products;
				if (this.selectedSite !== res.siteId) {
					//list rooms and tables
					if (this.showListRoom) {
						this.listRooms(res.siteId);
					}

					if (this.showListTable) {
						this.listTables(res.siteId);
					}
				}
				this.selectedSite = res.siteId;
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
		} else if (operation === '0' && this.order[index].quantity > 0) {
			this.order[index].quantity -= 1;
			this.totalAmountOfProduct -= this.order[index].price;
		}
		this.order[index].total =
			this.order[index].quantity * this.order[index].price;
	}

	delete(index): void {
		if (index !== -1) {
			this.order.splice(index, 1);
		}
	}

	async listRooms(siteId) {
		this.roomParams.siteId = siteId;
		const res = await this.roomService.listRoomsPromise(this.roomParams);
		if (res.status) {
			this.rooms = res.data.rooms;
		} else {
			return null;
		}
	}

	async listTables(siteId) {
		this.tableParams.siteId = siteId;
		const res = await this.tableService.listTablePromise(this.tableParams);
		if (res.status) {
			this.tables = res.data.tables;
		} else {
			return null;
		}
	}

	updateRoom(selectedRoomId: number): void {
		this.selectedRoom = selectedRoomId;
		this.selectedTable = 0;
		this.disableSaveButton = false;
		this.selectedType = 2;
	}

	updateTable(selectedTableId: number): void {
		this.selectedTable = selectedTableId;
		this.selectedRoom = 0;
		this.disableSaveButton = false;
		this.selectedType = 1;
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
