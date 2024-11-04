import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, interval } from 'rxjs';
import { ORDER_STATUS } from 'src/app/constants/core';
import { URL_ROUTES } from 'src/app/constants/routing';
import { IParams } from 'src/app/core/interface/params';
import { DialogService } from 'src/app/core/services/dialog.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountService } from '../../accounts/service/account.service';
import { RoleService } from '../../role/service/role.service';
import { SiteService } from '../../site/service/site.service';
import { StaffService } from '../../staff/service/staff.service';
import { OrderService } from '../service/order.service';
import { SocketService } from '../service/socket.service';

@Component({
	selector: 'app-list-order',
	templateUrl: './list-order.component.html',
	styleUrls: ['./list-order.component.scss'],
})
export class ListOrderComponent implements OnInit {
	constructor(
		public accountService: AccountService,
		private router: Router,
		private globalService: GlobalService,
		private siteServices: SiteService,
		private socketService: SocketService,
		private cdr: ChangeDetectorRef,
		private orderService: OrderService,
		private modalService: BsModalService,
		private roleService: RoleService,
		private staffService: StaffService,
		private dialogService: DialogService
	) {}

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

	siteParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};

	accountParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};

	assignUsersParams: IParams = {
		limit: 100,
		pageNumber: 1,
		siteId: null,
	};

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

	orderList: any = [];
	sitesList: any = [];
	selectedSite: number;
	accountList: any = [];
	total: number;
	perPage: number = 10;
	currentPage: number = 1;
	searchInput: string = '';
	orderType: number = 1;
	private subscription: Subscription;
	orders: any = [];
	modalRef?: BsModalRef;
	orderDetails: any;
	assignUsersList: any[] = [];
	roleList: any = [];
	staffList: any = [];
	selectedAccountId: number;
	selectedRoleId: number;
	selectedStaffId: number;
	selectedOrderId: number;
	siteCurrency: string = '';
	selectedOrderType: number = 0;

	ngOnInit(): void {
		if (this.showListAccount) {
			this.accountService.listUser(this.accountParams).subscribe((res) => {
				if (res.status) {
					this.accountList = [...res.data.users];
					if (this.accountList.length) {
						this.siteParams.accountId = this.accountList[0]?.account.id;
						this.selectedAccountId = this.accountList[0]?.account.id;
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
		this.orderList = this.orders
			.slice(startIndex, endIndex)
			.filter((item) =>
				item?.id
					.toString()
					.toLowerCase()
					.includes(this.searchInput.toString().toLowerCase())
			);

		this.total = this.searchInput ? this.orderList.length : this.orders.length;
	}

	onSearch(): void {
		this.currentPage = 1;
		this.updateDisplayedData();
	}

	changeAccountData(accountId: any) {
		if (accountId) {
			this.siteParams.accountId = accountId;
			this.selectedAccountId = accountId;
			this.listSiteAPI(this.siteParams);
		}
	}

	changeSitesData(siteId: any) {
		// call list order API
		if (siteId) {
			this.selectedSite = siteId;
			this.selectedOrderType = 0;
			this.listOrderAPI(
				this.selectedSite,
				this.orderType,
				this.selectedOrderType
			);
		}
	}

	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.sitesList = [...res.data.sites];
				if (this.sitesList.length) {
					//call list order API
					this.selectedSite = this.sitesList[0]?.id;
					this.assignUsersParams.siteId = this.sitesList[0]?.id;
					this.listOrderAPI(
						this.sitesList[0]?.id,
						this.orderType,
						this.selectedOrderType
					);
				}
		this.listenForSocketEvents();

			}
		});
	}

	routeToAddOrder() {
		this.router.navigateByUrl(URL_ROUTES.ADD_ORDER);
	}

	routeToKanban() {
		this.router.navigateByUrl(URL_ROUTES.KANBAN);
	}

	async listOrderAPI(siteId: any, categoryType: any, orderType: number) {
		const orderParams: IParams = {
			siteId,
			categoryType,
			orderType,
			limit: 100,
			pageNumber: 1,
		};
		const res = await this.orderService.listOrderPromise(orderParams);
		if (res.status) {
			this.orders = [...res.data.orders];
			this.updateDisplayedData();
		} else {
			return null;
		}
	}

	changeCategoryType(type: any) {
		this.orderType = type;
		if (this.sitesList.length) {
			this.listOrderAPI(
				this.sitesList[0]?.id,
				this.orderType,
				this.selectedOrderType
			);
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
					this.listStaffAPI(this.staffParams);
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

	changeStaffValue(staffId: number) {
		if (staffId) {
			this.selectedStaffId = staffId;
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

	openCancelDialogBox(orderId: number) {
		if (orderId) {
			this.dialogService.openCancelOrderConfirmDialg().then((result) => {
				if (result.value) {
					//call cancel order API
					this.orderService
						.updateOrderStatus(orderId, ORDER_STATUS.CANCELED)
						.then((res: any) => {
							if (res.status) {
								this.listOrderAPI(
									this.selectedSite,
									this.orderType,
									this.selectedOrderType
								);
							}
						});
				}
			});
		}
	}

	filterDataByType(orderType: number) {
		this.selectedOrderType = orderType;
		this.listOrderAPI(
			this.selectedSite,
			this.orderType,
			this.selectedOrderType
		);
	}

	filterDataByStatus(status: number) {
		switch (status) {
			case 0:
				this.listOrderAPI(
					this.selectedSite,
					this.orderType,
					this.selectedOrderType
				);
			case 1:
				this.orderList = this.orders.filter(
					(order) => order.status === ORDER_STATUS.CREATED
				);
				break;
			case 2:
				this.orderList = this.orders.filter(
					(order) => order.status === ORDER_STATUS.PROGRESS
				);
				break;
			case 3:
				this.orderList = this.orders.filter(
					(order) => order.status === ORDER_STATUS.COMPLETED
				);
				break;
			case 5:
				this.orderList = this.orders.filter(
					(order) => order.status === ORDER_STATUS.CANCELED
				);
				break;
		}
	}

	//method for socket events
	listenForSocketEvents() {
		this.subscription = interval(60000).subscribe(() => {
			this.cdr.markForCheck();
		});

		this.socketService.initialize(`${this.selectedSite}`, `${this.orderType}`);
		this.socketService.onNewOrder().subscribe((order) => {
			if (order && order.site === this.selectedSite) {
				this.orders.unshift(order);
				this.updateDisplayedData();
			}
		});
		this.socketService.updateOrder().subscribe((order) => {
			console.log('Order updated', order);
		});

		this.socketService.updateOrderStatus().subscribe((order) => {
				this.orders = this.orders.filter((item) => item.id !== order.id);
				this.orders.unshift(order);
				this.updateDisplayedData();
		});
	}
}
