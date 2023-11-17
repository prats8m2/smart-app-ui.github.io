import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountService } from '../../accounts/service/account.service';

import {
	hasError,
	isValid,
	isTouchedAndValid,
	isTouched,
} from 'src/app/core/helpers/form-error';
import { errorMessages } from 'src/app/core/helpers/form-error-message';
import { environment } from 'src/environments/environment';
import {
	ROLE_NAME_VALIDATION,
	SITE_ACCOUNT_VALIDATION,
} from 'src/app/constants/validations';
import { IParams } from 'src/app/core/interface/params';
import { RoleService } from '../service/role.service';

@Component({
	selector: 'app-add-role',
	templateUrl: './add-role.component.html',
	styleUrls: ['./add-role.component.scss'],
})
export class AddRoleComponent implements OnInit {
	isProduction = environment.production;
	public roleForm: FormGroup;
	accountList: any = [];
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	accountParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};

	headings: string[] = [
		'Category',
		'Device',
		'Menu',
		'Order',
		'Product',
		'Room',
		'Staff',
		'Table',
	];
	permissions: string[] = ['ADD', 'UPDATE', 'DELETE', 'VIEW', 'LIST'];
	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		public accountService: AccountService,
		private roleService: RoleService
	) {
		if (this.isProduction) {
			this.roleForm = this.formBuilder.group({
				account: [null],
				roleName: ['', ROLE_NAME_VALIDATION],
				permissions: this.formBuilder.group({}),
			});
		} else {
			const randomNumber = Math.floor(1000 + Math.random() * 9000);
			this.roleForm = this.formBuilder.group({
				account: [null],
				roleName: ['Role-' + randomNumber, ROLE_NAME_VALIDATION],
				permissions: this.formBuilder.group({}),
			});
		}
	}

	ngOnInit(): void {
		if (this.showListAccount) {
			this.roleForm.controls['account'].addValidators(SITE_ACCOUNT_VALIDATION);
			this.accountService.listUser(this.accountParams).subscribe((res) => {
				if (res.status) {
					this.accountList = [...res.data.users];
				}
			});
		}
		this.headings.forEach((heading) => {
			const headingGroup = {};
			this.permissions.forEach((permission) => {
				headingGroup[permission] = this.formBuilder.control(false);
				if (permission !== 'LIST') {
					headingGroup[permission].valueChanges.subscribe(() => {
						const allSelected = ['ADD', 'UPDATE', 'DELETE', 'VIEW'].every(
							(control) => headingGroup[control].value
						);
						headingGroup['LIST'].setValue(allSelected);
					});
				}
			});

			(this.roleForm.get('permissions') as FormGroup).addControl(
				heading,
				this.formBuilder.group(headingGroup)
			);
		});
	}

	routeToListRole() {
		this.router.navigateByUrl(URL_ROUTES.LIST_ROLE);
	}

	//form validation function
	isError(formControlName: string, errorType: string): boolean {
		return hasError(this.roleForm, formControlName, errorType);
	}

	showError(formControlName: string): boolean {
		return isValid(this.roleForm, formControlName);
	}

	showSuccess(formControlName: string): boolean {
		return isTouchedAndValid(this.roleForm, formControlName);
	}

	formTouched(formControlName: string): boolean {
		return isTouched(this.roleForm, formControlName);
	}

	errorMessage(formControlName: string, errorType: string): string {
		return errorMessages[formControlName][errorType];
	}

	addRole() {
		this.roleService.addRole(this.roleForm).then((res) => {
			if (res.status) {
				this.router.navigate([URL_ROUTES.LIST_ROLE]);
			} else {
				console.log('error');
			}
		});
	}
}
