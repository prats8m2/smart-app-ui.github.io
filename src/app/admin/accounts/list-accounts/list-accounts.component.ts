import { Component } from '@angular/core';
import { AccountService } from '../service/account.service';
import { Router } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { IParams } from '../../../core/interface/params';
import { URL_ROUTES } from '../../../constants/routing';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
	selector: 'app-list-accounts',
	templateUrl: './list-accounts.component.html',
	styleUrls: ['./list-accounts.component.scss'],
})
export class ListAccountsComponent {
	constructor(
		public accountService: AccountService,
		private router: Router,
		private globalService: GlobalService,
		private dialogService: DialogService
	) {}

	usersList: any = [];
	usersListResp: any = [];
	total: number;
	perPage: number = 10;
	currentPage: number = 1;
	searchInput: string = '';
	showAddButton: boolean = this.globalService.checkForPermission('ADD-ACCOUNT');
	showViewButton: boolean =
		this.globalService.checkForPermission('VIEW-ACCOUNT');
	showEditButton: boolean =
		this.globalService.checkForPermission('UPDATE-ACCOUNT');
	showDeleteButton: boolean =
		this.globalService.checkForPermission('DELETE-ACCOUNT');

	userParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};

	ngOnInit(): void {
		this.listUserAPI();
	}

	listUserAPI() {
		this.accountService.listUser(this.userParams).subscribe((res) => {
			if (res.status) {
				this.usersListResp = [...res.data.users];
				this.total = this.usersListResp.length;
				this.updateDisplayedData();
			}
		});
	}

	routeToAddAccount() {
		this.router.navigateByUrl(URL_ROUTES.ADD_ACCOUNT);
	}
	routeToEditAccount(accountId: number) {
		if (this.showEditButton) {
			this.router.navigateByUrl(URL_ROUTES.EDIT_ACCOUNT + '/' + accountId);
		}
	}
	routeToViewAccount(accountId: number) {
		if (this.showViewButton) {
			this.router.navigateByUrl(URL_ROUTES.VIEW_ACCOUNT + '/' + accountId);
		}
	}

	pageChanged(event: any): void {
		this.currentPage = event.page;
		this.updateDisplayedData();
	}

	updateDisplayedData(): void {
		const startIndex = (this.currentPage - 1) * this.perPage;
		const endIndex = startIndex + this.perPage;
		this.usersList = this.usersListResp
			.slice(startIndex, endIndex)
			.filter(
				(item) =>
					item.firstName
						.toLowerCase()
						.includes(this.searchInput.toLowerCase()) ||
					item.lastName
						.toLowerCase()
						.includes(this.searchInput.toLowerCase()) ||
					item.account.name
						.toLowerCase()
						.includes(this.searchInput.toLowerCase()) ||
					item.email.toLowerCase().includes(this.searchInput.toLowerCase())
			);

		this.total = this.searchInput
			? this.usersList.length
			: this.usersListResp.length;
	}

	onSearch(): void {
		this.currentPage = 1;
		this.updateDisplayedData();
	}

	openDeleteConfirmDialog(accountId: any) {
		this.dialogService.openDeleteConfirmDialog().then((result) => {
			if (result.value) {
				//call delete account API
				this.accountService.deleteAccount(accountId).then((res: any) => {
					if (res.status) {
						this.listUserAPI();
					}
				});
			}
		});
	}
}
