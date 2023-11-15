import { Component } from '@angular/core';
import { AccountService } from '../service/account.service';
import { Router } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { IParams } from '../../../core/interface/params';
import { UntypedFormGroup } from '@angular/forms';
import { URL_ROUTES } from '../../../constants/routing';

@Component({
	selector: 'app-list-accounts',
	templateUrl: './list-accounts.component.html',
	styleUrls: ['./list-accounts.component.scss'],
})
export class ListAccountsComponent {
	constructor(
		public accountService: AccountService,
		private router: Router,
		private globalService: GlobalService
	) {}

	usersList: any = [];
	usersListResp: any = [];
	total: number;
	perPage: number = 10;
	currentPage: number = 1;
	searchInput: string = '';

	userParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};

	ngOnInit(): void {
		this.listUserAPI();
	}

	listUserAPI() {
		this.accountService.listUser(this.userParams).then((res) => {
			this.usersListResp = [...res.data.users];
			this.total = this.usersListResp.length;
			this.updateDisplayedData();
		});
	}

	routeToAddAccount() {
		this.router.navigateByUrl(URL_ROUTES.ADD_ACCOUNT);
	}
	routeToEditAccount(accountId: number) {
		this.router.navigateByUrl(URL_ROUTES.EDIT_ACCOUNT + '/' + accountId);
	}
	routeToViewAccount(accountId: number) {
		this.router.navigateByUrl(URL_ROUTES.VIEW_ACCOUNT + '/' + accountId);
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
		this.currentPage = 1; // Reset to the first page when performing a new search
		this.updateDisplayedData();
	}

	deleteAccount(id: any) {
		this.accountService.deleteUser(id).then((res) => {
			if (res.status) {
				console.log('Account deleted successfully');
				this.router.navigateByUrl(URL_ROUTES.LIST_ACCOUNT);
				this;
			} else {
				console.log('Error in deleting account');
			}
		});
	}
}
