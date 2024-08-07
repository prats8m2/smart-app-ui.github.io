import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
import { Router } from '@angular/router';
import { URL_ROUTES } from '../../../constants/routing';
import { environment } from 'src/environments/environment';
import { DialogService } from 'src/app/core/services/dialog.service';
import { GlobalService } from 'src/app/core/services/global.service';

@Component({
	selector: 'app-add-account',
	templateUrl: './add-account.component.html',
	styleUrls: ['./add-account.component.scss'],
})
export class AddAccountComponent {
	isProduction = environment.production;
	public userForm: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private accountService: AccountService,
		private router: Router,
		private dialogService: DialogService,
		private globalService: GlobalService
	) {
		if (this.isProduction) {
			this.userForm = this.formBuilder.group({
				firstName: ['', FIRST_NAME_VALIDATION],
				lastName: ['', LAST_NAME_VALIDATION],
				username: [null, USER_NAME_VALIDATION],
				email: ['', EMAIL_VALIDATION],
				password: ['', PASSWORD_VALIDATION],
				mobile: ['', PHONE_VALIDATION],
				status: [true],
				accountName: ['', ACCOUNT_NAME_VALIDATION],
			});
		} else {
			const randomNumber = Math.floor(1000 + Math.random() * 9000);
			this.userForm = this.formBuilder.group({
				firstName: ['John' + randomNumber, FIRST_NAME_VALIDATION],
				lastName: ['Doe' + randomNumber, LAST_NAME_VALIDATION],
				username: ['john-' + randomNumber, USER_NAME_VALIDATION],
				email: ['john-' + randomNumber + '@yopmail.com', EMAIL_VALIDATION],
				password: ['Pass@1234', PASSWORD_VALIDATION],
				mobile: ['9876543210', PHONE_VALIDATION],
				status: [true],
				accountName: ['Account-' + randomNumber, ACCOUNT_NAME_VALIDATION],
			});
		}
	}

	ngOnInit() {
		this.userForm.get('status').disable();
		this.globalService.formControlValuesChanged(this.userForm);
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

	public addAccount() {
		this.accountService.addUser(this.userForm).then((res) => {
			if (res.status) {
				this.router.navigate([URL_ROUTES.LIST_ACCOUNT]);
				this.globalService.enableSideNavRouting();
			} else {
				console.log('error');
			}
		});
	}

	routeToListAccount() {
		if (!this.userForm.dirty) {
			this.router.navigateByUrl(URL_ROUTES.LIST_ACCOUNT);
		} else {
			this.dialogService.openBackConfirmDialog().then((result) => {
				if (result.value) {
					this.router.navigateByUrl(URL_ROUTES.LIST_ACCOUNT);
					this.globalService.enableSideNavRouting();
				}
			});
		}
	}

	toggle(): void {
		const statusControl = this.userForm.get('status') as FormControl;
		statusControl.setValue(!statusControl.value);
	}
}
