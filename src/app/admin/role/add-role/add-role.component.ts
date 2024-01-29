import { Component, OnInit } from '@angular/core';
import {
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
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
import { transformUserPermissions } from 'src/app/core/helpers/roleJsonConverter';
import { ROLE_PERMISSIONS } from 'src/app/constants/rolePermissions';

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
	permissionParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};
	categoryDropdowncounter: any[] = [];

	permissionsData: any = {};

	permissionsCheckBoxData: any;

	allPermissions = ROLE_PERMISSIONS;
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
				userPermissions: this.formBuilder.group({}),
			});
		} else {
			const randomNumber = Math.floor(1000 + Math.random() * 9000);
			this.roleForm = this.formBuilder.group({
				account: [null],
				roleName: ['Role-' + randomNumber, ROLE_NAME_VALIDATION],
				userPermissions: this.formBuilder.group({}),
			});

			this.getpermissionsToShow();
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
	}

	routeToListRole() {
		this.router.navigateByUrl(URL_ROUTES.LIST_ROLE);
	}

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
		console.log(this.roleForm.value);
	}

	changeAccountData(accountId: any) {
		this.permissionParams.accountId = accountId;
		this.listPermissionsAPI(this.permissionParams);
	}

	listPermissionsAPI(params: any) {
		this.roleService.listPermissions(params).subscribe((res) => {
			if (res.status) {
				this.permissionsData = res.data.permissions;
			}
		});
	}

	getpermissionsToShow() {
		const userPermissions: any = transformUserPermissions(
			this.globalService.getUserRole('permissions')
		);

		this.permissionsCheckBoxData = userPermissions.map((userPer: any) => {
			const matchingPermissions = this.allPermissions.filter(
				(allPer: any) => userPer.categoryId === allPer.permissionCategoryId
			);

			return {
				categoryId: userPer.categoryId,
				categoryName: userPer.category,
				subLabels: userPer.subLabels
					.map((u: any) => {
						const matchingSubLabels = matchingPermissions
							.flatMap((a: any) => a.subLabels)
							.filter((a: any) => u.id === a.permissionId);

						return matchingSubLabels.map((a: any) => ({
							permissionText: a.permissionLabel,
							permissionId: a.permissionId,
							isSelected: false,
							val: 'val',
						}));
					})
					.flat(),
			};
		});

		this.roleForm.get('userPermissions').setValidators(Validators.required);
		this.roleForm.get('userPermissions').updateValueAndValidity();
		this.permissionsCheckBoxData.forEach((key) => {
			const formArray = key.subLabels.map((permission) => {
				return this.formBuilder.group({
					[permission.permissionText]: new FormControl(false),
					id: permission.permissionId,
					val: false,
				});
			});

			(this.roleForm.get('userPermissions') as FormGroup).addControl(
				key.categoryName,
				this.formBuilder.array(formArray)
			);
		});
	}

	get userPermissions() {
		return this.roleForm.get('userPermissions') as FormGroup;
	}

	userPermissionsControls() {
		let fg = this.roleForm.get('userPermissions') as FormGroup;
		return Object.keys(fg?.controls) as string[];
	}

	getFg(formArrayName: string) {
		let fa = this.userPermissions.get(formArrayName) as FormArray;
		return fa?.controls as FormGroup[];
	}

	getKeyName(object: any) {
		const keys: string[] = Object.keys(object);
		return keys[0];
	}

	getSectionName(index: number) {
		let fg = this.roleForm.get('userPermissions') as FormGroup;
		let keys = Object.keys(fg?.controls);
		return keys[index];
	}
}
