import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountService } from '../../accounts/service/account.service';
import { RoleService } from '../service/role.service';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
	selector: 'app-list-role',
	templateUrl: './list-role.component.html',
	styleUrls: ['./list-role.component.scss'],
})
export class ListRoleComponent {
	constructor(
		public accountService: AccountService,
		private router: Router,
		private globalService: GlobalService,
		private roleService: RoleService,
		private dialogService: DialogService
	) {}

	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showAddRole: boolean = this.globalService.checkForPermission('ADD-ROLE');
	showEditRole: boolean = this.globalService.checkForPermission('UPDATE-ROLE');
	showViewRole: boolean = this.globalService.checkForPermission('VIEW-ROLE');
	showDeleteRole: boolean =
		this.globalService.checkForPermission('DELETE-ROLE');

	accountParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};
	accountList: any = [];
	roleList: any = [];
	roleListResp: any = [];
	total: number;
	perPage: number = 10;
	currentPage: number = 1;
	searchInput: string = '';
	roleParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};

	ngOnInit(): void {
		if (this.showListAccount) {
			this.accountService.listUser(this.accountParams).subscribe((res) => {
				if (res.status) {
					this.accountList = [...res.data.users];
					if (this.accountList.length) {
						this.roleParams.accountId = this.accountList[0]?.account?.id;
						this.listRoleAPI(this.roleParams);
					}
				}
			});
		} else {
			this.listRoleAPI(this.roleParams);
		}
	}

	routeToAddRole() {
		this.router.navigateByUrl(URL_ROUTES.ADD_ROLE);
	}
	routeToEditRole(roleId: number) {
		this.router.navigateByUrl(URL_ROUTES.EDIT_ROLE + '/' + roleId);
	}
	routeToViewRole(roleId: number) {
		if (this.showViewRole) {
			this.router.navigateByUrl(URL_ROUTES.VIEW_ROLE + '/' + roleId);
		}
	}

	pageChanged(event: any): void {
		this.currentPage = event.page;
		this.updateDisplayedData();
	}

	updateDisplayedData(): void {
		const startIndex = (this.currentPage - 1) * this.perPage;
		const endIndex = startIndex + this.perPage;
		this.roleList = this.roleListResp
			.slice(startIndex, endIndex)
			.filter((item) =>
				item.name.toLowerCase().includes(this.searchInput.toLowerCase())
			);

		this.total = this.searchInput
			? this.roleList.length
			: this.roleListResp.length;
	}

	onSearch(): void {
		this.currentPage = 1; // Reset to the first page when performing a new search
		this.updateDisplayedData();
	}

	changeSitesData(accountId: any) {
		if (accountId) {
			this.roleParams.accountId = accountId;
			this.listRoleAPI(this.roleParams);
		}
	}

	listRoleAPI(params: IParams) {
		this.roleService.listRoles(params).subscribe((res) => {
			if (res.status) {
				this.roleListResp = [...res.data.roles];
				this.updateDisplayedData();
			}
		});
	}

	openDeleteConfirmDialog(roleId: any) {
		this.dialogService.openDeleteConfirmDialog().then((result) => {
			if (result.value) {
				//call delete role API
				this.roleService.deleteRole(roleId).then((res: any) => {
					if (res.status) {
						this.listRoleAPI(this.roleParams);
					}
				});
			}
		});
	}
}
