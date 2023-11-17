import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountService } from '../../accounts/service/account.service';
import { SiteService } from '../../site/service/site.service';
import { RoleService } from '../service/role.service';
import Swal from 'sweetalert2';

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
		private siteServices: SiteService,
		private roleService: RoleService
	) {}

	showListAccount: boolean = this.globalService.checkForPermission('LIST-USER');
	showAddRole: boolean = this.globalService.checkForPermission('ADD-ROLE');

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
	userRole: string;
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
		this.router.navigateByUrl(URL_ROUTES.VIEW_ROLE + '/' + roleId);
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
		this.roleParams.accountId = accountId;
		this.listRoleAPI(this.roleParams);
	}

	listRoleAPI(params: IParams) {
		this.roleService.listRoles(params).subscribe((res) => {
			if (res.status) {
				this.roleListResp = [...res.data.roles];
				this.updateDisplayedData();
			}
		});
	}
	confirm(i: any) {
		console.log('111');
	}

	showSWAL() {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#34c38f',
			cancelButtonColor: '#f46a6a',
			confirmButtonText: 'Yes, delete it!',
		}).then((result) => {
			if (result.value) {
				Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
			}
		});
	}
}
