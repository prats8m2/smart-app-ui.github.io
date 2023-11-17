import { Component } from '@angular/core';
import { GlobalService } from '../../../core/services/global.service';
import { AccountService } from '../../accounts/service/account.service';
import { IParams } from '../../../core/interface/params';
import { SiteService } from '../../site/service/site.service';
import { RoleService } from '../../role/service/role.service';

@Component({
	selector: 'app-list-staff',
	templateUrl: './list-staff.component.html',
	styleUrls: ['./list-staff.component.scss'],
})
export class ListStaffComponent {
	constructor(
		private globalService: GlobalService,
		private accountService: AccountService,
		private siteService: SiteService,
		private roleService: RoleService
	) {}
	showListAccount: boolean = this.globalService.checkForPermission('LIST-USER');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');

	accountParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};

	siteParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};

	roleParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};
	accountList: any = [];
	siteList: any = [];
	roleList: any = [];

	ngOnInit(): void {
		//Fetch Account
		if (this.showListAccount) {
			this.accountList = this.accountService
				.listUser(this.accountParams)
				.subscribe((res) => {
					if (res.status) {
						this.accountList = [...res.data.users];
						this.siteParams.accountId = this.accountList[0].id;
						this.roleParams.accountId = this.accountList[0].id;
						console.log('this.accountList[0].id;:', this.accountList[0].id);
					}
				});
		}

		console.log('this.siteParams:', this.siteParams);
		//Fetch Site
		this.siteList = this.siteService
			.listSites(this.siteParams)
			.subscribe((res) => {
				if (res.status) {
					this.siteList = [...res.data.users];
				}
			});

		//Fetch Roles
		this.roleList = this.roleService
			.listRoles(this.siteParams)
			.subscribe((res) => {
				if (res.status) {
					this.roleList = [...res.data.roles];
				}
			});
	}
}
