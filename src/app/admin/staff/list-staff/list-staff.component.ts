import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../core/services/global.service';
import { AccountService } from '../../accounts/service/account.service';
import { IParams } from '../../../core/interface/params';
import { URL_ROUTES } from 'src/app/constants/routing';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/core/services/dialog.service';
import { RoleService } from '../../role/service/role.service';
import { StaffService } from '../service/staff.service';

@Component({
	selector: 'app-list-staff',
	templateUrl: './list-staff.component.html',
	styleUrls: ['./list-staff.component.scss'],
})
export class ListStaffComponent implements OnInit {
	sitesList: any = [];
	constructor(
		public accountService: AccountService,
		private router: Router,
		private globalService: GlobalService,
		private dialogService: DialogService,
		private roleService: RoleService,
		private staffService: StaffService
	) {}

	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showAddStaff: boolean = this.globalService.checkForPermission('ADD-ROLE');
	showEditStaff: boolean =
		this.globalService.checkForPermission('UPDATE-STAFF');
	showDeleteStaff: boolean =
		this.globalService.checkForPermission('DELETE-STAFF');
	showViewStaff: boolean = this.globalService.checkForPermission('VIEW-STAFF');

	accountParams: IParams = {
		limit: 100,
		pageNumber: 1,
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

	accountList: any = [];
	roleList: any = [];
	staffList: any = [];

	staffListResp: any = [];
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
						this.roleParams.accountId = this.accountList[0].account.id;
						this.listRoleAPI(this.roleParams);
					}
				}
			});
		} else {
			this.listRoleAPI(this.roleParams);
		}
	}

	routeToAddStaff() {
		this.router.navigateByUrl(URL_ROUTES.ADD_STAFF);
	}

	routeToEditStaff(staffId: any) {
		this.router.navigateByUrl(URL_ROUTES.EDIT_STAFF + '/' + staffId);
	}
	routeToViewStaff(staffId: any) {
		if (this.showViewStaff) {
			this.router.navigateByUrl(URL_ROUTES.VIEW_STAFF + '/' + staffId);
		}
	}

	pageChanged(event: any): void {
		this.currentPage = event.page;
		this.updateDisplayedData();
	}

	updateDisplayedData(): void {
		const startIndex = (this.currentPage - 1) * this.perPage;
		const endIndex = startIndex + this.perPage;
		this.staffList = this.staffListResp
			.slice(startIndex, endIndex)
			.filter(
				(item) =>
					item.firstName
						.toLowerCase()
						.includes(this.searchInput.toLowerCase()) ||
					item.lastName
						.toLowerCase()
						.includes(this.searchInput.toLowerCase()) ||
					item.username
						.toLowerCase()
						.includes(this.searchInput.toLowerCase()) ||
					item.email.toLowerCase().includes(this.searchInput.toLowerCase())
			);

		this.total = this.searchInput
			? this.staffList.length
			: this.staffListResp.length;
	}

	onSearch(): void {
		this.currentPage = 1;
		this.updateDisplayedData();
	}

	changeAccountData(accountId: any) {
		if (accountId) {
			this.staffListResp = [];
			this.updateDisplayedData();
			this.roleParams.accountId = accountId;
			this.listRoleAPI(this.roleParams);
		}
	}

	listRoleAPI(params: IParams) {
		this.roleService.listRoles(params).subscribe((res) => {
			if (res.status) {
				this.roleList = [...res.data.roles];
				if (this.roleList.length) {
					this.staffParams.roleId = this.roleList[0].id;
					this.listStaffAPI(this.staffParams);
				}
			}
		});
	}
	changeRoleData(roleId: any) {
		if (roleId) {
			this.staffParams.roleId = roleId;
			this.listStaffAPI(this.staffParams);
		}
	}

	listStaffAPI(params: IParams) {
		this.staffService.listStaff(params).subscribe((res) => {
			if (res.status) {
				this.staffListResp = [...res.data.users];
				this.updateDisplayedData();
			}
		});
	}

	openDeleteConfirmDialog(deviceId: any) {
		this.dialogService.openDeleteConfirmDialog().then((result) => {
			if (result.value) {
				//call delete device API
				this.staffService.deleteStaff(deviceId).then((res: any) => {
					if (res.status) {
						this.listStaffAPI(this.staffParams);
					}
				});
			}
		});
	}
}
