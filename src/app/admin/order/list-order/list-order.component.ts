import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { URL_ROUTES } from 'src/app/constants/routing';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountService } from '../../accounts/service/account.service';
import { SiteService } from '../../site/service/site.service';
import { OrderService } from '../service/order.service';
import { SocketService } from '../service/socket.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RoleService } from '../../role/service/role.service';
import { StaffService } from '../../staff/service/staff.service';
import { DialogService } from 'src/app/core/services/dialog.service';

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
			this.subscription = interval(60000).subscribe(() => {
				this.cdr.markForCheck();
			});
			this.socketService.onNewOrder().subscribe((order) => {
				this.orders.push(order);
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
		this.orderList = this.orders.slice(startIndex, endIndex);

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
			this.listOrderAPI(this.selectedSite, this.orderType);
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
					this.listOrderAPI(this.sitesList[0]?.id, this.orderType);
				}
			}
		});
	}

	routeToAddOrder() {
		this.router.navigateByUrl(URL_ROUTES.ADD_ORDER);
	}

	routeToKanban() {
		this.router.navigateByUrl(URL_ROUTES.KANBAN);
	}

	async listOrderAPI(siteId: any, type: any) {
		const orderParams: IParams = {
			siteId,
			type: type,
			limit: 100,
			pageNumber: 1,
		};
		const res = await this.orderService.listOrderPromise(orderParams);
		if (res.status) {
			this.orders = res.data.orders;
			this.updateDisplayedData();
		} else {
			return null;
		}
	}

	changeCategoryType(type: any) {
		this.orderType = type;
		if (this.sitesList.length) {
			this.listOrderAPI(this.sitesList[0]?.id, this.orderType);
		}
	}

	openViewModal(content: any, orderId: number) {
		//call get order api
		this.orderService.viewOrder(orderId).then((res) => {
			if (res.status && res.data) {
				this.orderDetails = res.data;
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
					//call delete site API
					this.orderService.cancelOrder(orderId).then((res: any) => {
						if (res.status) {
							this.listOrderAPI(this.selectedSite, this.orderType);
						}
					});
				}
			});
		}
	}
}
