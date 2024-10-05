import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { OrderService } from '../service/order.service';
import { IParams } from 'src/app/core/interface/params';
import { SocketService } from '../service/socket.service';
import { Subscription, interval } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RoleService } from '../../role/service/role.service';
import { StaffService } from '../../staff/service/staff.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ORDER_STATUS } from 'src/app/constants/core';

@Component({
	selector: 'app-kanban',
	templateUrl: './kanban.component.html',
	styleUrls: ['./kanban.component.scss'],
})
export class KanbanComponent implements OnInit {
	constructor(
		private orderService: OrderService,
		private socketService: SocketService,
		private cdr: ChangeDetectorRef,
		private modalService: BsModalService,
		private roleService: RoleService,
		private staffService: StaffService,
		private globalService: GlobalService,
		private dialogService: DialogService
	) {
		document.body.setAttribute('data-bs-theme', 'dark');
		this.orderService.ordersChange.subscribe((res) => {
			if (res) {
				this.selectedAccountId = res?.accountId;
				this.selectedCategoryType = res.selectedCategortType;
				this.listOrders(res.siteId, res.orderType, this.selectedCategoryType);
			}
		});
	}

	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showAddOrder: boolean = this.globalService.checkForPermission('ADD-ORDER');
	showViewOrder: boolean = this.globalService.checkForPermission('VIEW-ORDER');
	showEditOrder: boolean =
		this.globalService.checkForPermission('UPDATE-ORDER');
	showDeleteOrder: boolean =
		this.globalService.checkForPermission('DELETE-ORDER');
	showAssignOrder: boolean =
		this.globalService.checkForPermission('LIST-STAFF');
	showListRole: boolean = this.globalService.checkForPermission('LIST-ROLE');
	showListStaff: boolean = this.globalService.checkForPermission('LIST-STAFF');

	orders: any = [];
	newOrders: any = [];
	inProgresOrders: any = [];
	roleList: any = [];
	staffList: any = [];
	completedOrders: any = [];
	private subscription: Subscription;
	orderDetails: any;
	modalRef?: BsModalRef;
	selectedAccountId: number;
	selectedRoleId: number;
	selectedStaffId: number;
	selectedOrderId: number;
	selectedSiteId: number;
	selectedCategoryType!: string;
	selectedTypeId: number;
	siteCurrency: string = '';

	roleParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};

	staffParams: IParams = {
		roleId: null,
		limit: 100,
		pageNumber: 1,
	};

	ngOnInit(): void {
		this.subscription = interval(60000).subscribe(() => {
			this.cdr.markForCheck();
		});
		this.socketService.onNewOrder().subscribe((order) => {
			this.orders.unshift({
				...order,
				isNew: true,
				isUpdated: false,
				isDeleted: false,
			});
			this.filterForKanban();
		});

		this.socketService.updateOrderStatus().subscribe((order) => {
			this.orders = this.orders.map((item) =>
				item.id === order.id
					? {
							...item,
							status: order.status,
							isNew: false,
							isUpdated: true,
							isDeleted: order.status === ORDER_STATUS.CANCELED,
					  }
					: item
			);
			this.filterForKanban();
		});
	}

	async listOrders(siteId: any, type: number, categoryType: any) {
		const orderParams: IParams = {
			siteId,
			orderType: categoryType,
			categoryType: type,
			limit: 100,
			pageNumber: 1,
		};
		this.selectedSiteId = siteId;
		this.selectedTypeId = type;
		const res = await this.orderService.listOrderPromise(orderParams);
		if (res.status) {
			this.orders = res.data.orders.map((order: any) => ({
				...order,
				isNew: false,
				isUpdated: false,
				isDeleted: false,
			}));
			this.filterForKanban();
		} else {
			return null;
		}
	}

	filterForKanban() {
		this.newOrders = this.orders.filter(
			(t) => t.status === ORDER_STATUS.CREATED
		);
		this.inProgresOrders = this.orders.filter(
			(t) => t.status === ORDER_STATUS.PROGRESS
		);
		this.completedOrders = this.orders.filter(
			(t) => t.status === ORDER_STATUS.COMPLETED
		);
	}

	onDrop(event: DndDropEvent, filteredList?: any[], targetStatus?: number) {
		const order = event.data;
		if (filteredList && event.dropEffect === 'move') {
			if (targetStatus != order.status) {
				this.updateOrderStatus(order.id, targetStatus);
			}
			let index = event.index;
			if (typeof index === 'undefined') {
				index = filteredList.length;
			}
			filteredList.splice(index, 0, event.data);
		}
	}

	onDropCompleted(item: any, filteredList?: any[]) {
		const index = filteredList.indexOf(item);
		filteredList.splice(index, 1);
	}

	// update order status
	async updateOrderStatus(id: number, status: number) {
		const res = await this.orderService.updateOrderStatus(id, status);
		if (res.status) {
			return true;
		} else {
			return false;
		}
	}
	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	openViewModal(content: any, orderId: number) {
		//call get order api
		this.orderService.viewOrder(orderId).then((res) => {
			if (res.status && res.data) {
				this.orderDetails = res.data;
				this.siteCurrency = res.data.site.settings.currency;
			} else {
				this.orderDetails = null;
			}
			this.modalRef = this.modalService.show(content);
		});
	}

	openAssignModal(content: any, orderId: number) {
		//call list roles api
		if (content && orderId) {
			this.roleParams.accountId = this.selectedAccountId;
			this.listRoleAPI(this.roleParams);
			this.selectedOrderId = orderId;
		}
		this.modalRef = this.modalService.show(content);
	}

	listRoleAPI(params: IParams) {
		this.roleService.listRoles(params).subscribe((res) => {
			if (res.status) {
				this.roleList = [...res.data.roles];
				if (this.roleList.length) {
					this.selectedRoleId = this.roleList[0].id;
					this.staffParams.roleId = this.roleList[0].id;
				}
			}
		});
	}

	listStaffAPI(params: IParams) {
		this.staffService.listStaff(params).subscribe((res) => {
			if (res.status) {
				this.staffList = [...res.data.users];
				if (this.staffList.length) {
					this.selectedStaffId = this.staffList[0].id;
				}
			}
		});
	}

	changeRoleValue(roleId: number) {
		if (roleId) {
			this.selectedRoleId = roleId;
			this.staffParams.roleId = roleId;
			this.listStaffAPI(this.staffParams);
		}
	}

	openCancelDialogBox(orderId: number) {
		if (orderId) {
			this.dialogService.openCancelOrderConfirmDialg().then((result) => {
				if (result.value) {
					//call cancel order  API
					this.orderService
						.updateOrderStatus(orderId, ORDER_STATUS.CANCELED)
						.then((res: any) => {
							if (res.status) {
								this.listOrders(
									this.selectedSiteId,
									this.selectedTypeId,
									this.selectedCategoryType
								);
							}
						});
				}
			});
		}
	}

	assignOrder() {
		if (this.selectedOrderId && this.selectedStaffId) {
			this.orderService
				.assignOrder(this.selectedOrderId, this.selectedStaffId)
				.then((res) => {
					if (res.status) {
						this.modalRef.hide();
					}
				});
		}
	}
}
