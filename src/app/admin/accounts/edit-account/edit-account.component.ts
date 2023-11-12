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
import {
	hasError,
	isTouched,
	isTouchedAndValid,
	isValid,
} from '../../../core/helpers/form-error';
import { errorMessages } from '../../../core/helpers/form-error-message';
import { AccountService } from '../service/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_ROUTES } from '../../../constants/routing';
@Component({
	selector: 'app-edit-account',
	templateUrl: './edit-account.component.html',
	styleUrls: ['./edit-account.component.scss'],
})
export class EditAccountComponent {
	constructor(
		private formBuilder: FormBuilder,
		private accountService: AccountService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {}
	public userForm: FormGroup = this.formBuilder.group({
		id: [''],
		firstName: ['', FIRST_NAME_VALIDATION],
		lastName: ['', LAST_NAME_VALIDATION],
		username: [null, USER_NAME_VALIDATION],
		email: ['', EMAIL_VALIDATION],
		accountName: ['', ACCOUNT_NAME_VALIDATION],
		password: ['', PASSWORD_VALIDATION],
		mobile: ['', PHONE_VALIDATION],
	});
	ngOnInit() {
		this.getAccount();
	}
	//form validation function
	isError(formControlName: string, errorType: string): boolean {
		return hasError(this.userForm, formControlName, errorType);
	}

	showError(formControlName: string): boolean {
		return isValid(this.userForm, formControlName);
	}

	showSuccess(formControlName: string): boolean {
		return isTouchedAndValid(this.userForm, formControlName);
	}

	formTouched(formControlName: string): boolean {
		return isTouched(this.userForm, formControlName);
	}

	errorMessage(formControlName: string, errorType: string): string {
		return errorMessages[formControlName][errorType];
	}

	getAccount() {
		this.activatedRoute.params.subscribe((params) => {
			let userId = params['id'];
			console.log("params['id'];:", params);
			this.userForm.value.id = params['id'];
			this.accountService.viewUser(userId).then((res) => {
				if (res.status === true) {
					this.userForm.patchValue(res.data);
					this.userForm.get('password')?.patchValue('Pass@1234');
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
}
