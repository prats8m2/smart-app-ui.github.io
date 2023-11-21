import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
	ACCOUNT_NAME_VALIDATION,
	EMAIL_VALIDATION,
	FIRST_NAME_VALIDATION,
	LAST_NAME_VALIDATION,
	PASSWORD_VALIDATION,
	PHONE_VALIDATION,
	USER_NAME_VALIDATION,
} from '../../../constants/validations';
import { AccountService } from '../service/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_ROUTES } from '../../../constants/routing';
import { DialogService } from 'src/app/core/services/dialog.service';
import { GlobalService } from 'src/app/core/services/global.service';
@Component({
	selector: 'app-view-account',
	templateUrl: './view-account.component.html',
	styleUrls: ['./view-account.component.scss'],
})
export class ViewAccountComponent {
	constructor(
		private formBuilder: FormBuilder,
		private accountService: AccountService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private dialogService: DialogService,
		private globalService: GlobalService
	) {}

	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showDeleteAccount: boolean =
		this.globalService.checkForPermission('DELETE-ACCOUNT');

	public userForm: FormGroup = this.formBuilder.group({
		id: [''],
		firstName: ['', FIRST_NAME_VALIDATION],
		lastName: ['', LAST_NAME_VALIDATION],
		username: [null, USER_NAME_VALIDATION],
		email: ['', EMAIL_VALIDATION],
		accountName: ['', ACCOUNT_NAME_VALIDATION],
		password: ['', PASSWORD_VALIDATION],
		mobile: ['', PHONE_VALIDATION],
		status: [true],
	});
	ngOnInit() {
		this.getAccount();
	}
	getAccount() {
		this.activatedRoute.params.subscribe((params) => {
			let userId = params['id'];
			console.log("params['id'];:", params);
			this.userForm.value.id = params['id'];
			this.accountService.viewUser(userId).then((res) => {
				if (res.status === true) {
					this.userForm.disable();
					this.userForm.patchValue(res.data);
					this.userForm.get('password')?.patchValue('Pass@1234');
					const status = res.data.account.status ? true : false;
					this.userForm.get('status')?.patchValue(status);
					console.log(this.userForm);
					this.userForm.get('accountName').patchValue(res.data.account.name);
				}
			});
		});
	}

	editAccount() {
		this.accountService.updateUser(this.userForm).then((res) => {
			if (res.status) {
				this.router.navigate([URL_ROUTES.LIST_ACCOUNT]);
			} else {
				console.log('error');
			}
		});
	}

	routeToListAccount() {
		this.router.navigateByUrl(URL_ROUTES.LIST_ACCOUNT);
	}

	deleteAccount() {
		let accountId: any;
		this.activatedRoute.params.subscribe((params) => {
			accountId = params['id'];
		});
		this.dialogService.openConfirmDialog().then((result) => {
			if (result.value) {
				//call delete account API
				this.accountService.deleteAccount(accountId).then((res: any) => {
					if (res.status) {
						this.router.navigateByUrl(URL_ROUTES.LIST_ACCOUNT);
					}
				});
			}
		});
	}
}
