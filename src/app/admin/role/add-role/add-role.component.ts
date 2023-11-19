import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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

@Component({
	selector: 'app-add-role',
	templateUrl: './add-role.component.html',
	styleUrls: ['./add-role.component.scss'],
	encapsulation: ViewEncapsulation.None,
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

	permissionsData: any = {};
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

			this.listPermissionsAPI(this.permissionParams);
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

	initialisePermissions() {
		this.roleForm.get('userPermissions').setValidators(Validators.required);
		this.roleForm.get('userPermissions').updateValueAndValidity();
		Object.keys(this.permissionsData).forEach((key) => {
			const formArray = this.permissionsData[key].map((permission) => {
				return this.formBuilder.group({
					[permission.name]: new FormControl(false),
					id: permission.id,
				});
			});

			(this.roleForm.get('userPermissions') as FormGroup).addControl(
				key,
				this.formBuilder.array(formArray)
			);
		});
	}

	getFormControl(category: string, index: number): FormControl {
		const formArray = (this.roleForm.get('userPermissions') as FormGroup).get(
			category
		) as FormArray;
		const formGroup = formArray.controls[index] as FormGroup;
		return formGroup.get(Object.keys(formGroup.controls)[0]) as FormControl;
	}

	getPermissionLabel(permissionName: string): string {
		return permissionName.split('-')[0];
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
		const selectedPermissions = {};
		const transformedPermissionsData: any[] = [];
		const originalPermissionsData = this.roleForm.get('userPermissions').value;

		Object.keys(originalPermissionsData).forEach((key) => {
			selectedPermissions[key] = this.roleForm.value.userPermissions[key]
				.filter((permission) => permission[Object.keys(permission)[0]])
				.map((permission) => permission[Object.keys(permission)[0]]);
		});

		Object.keys(originalPermissionsData).forEach((category) => {
			originalPermissionsData[category].forEach((permission) => {
				originalPermissionsData[category]
					.filter((obj) => obj[Object.keys(obj)[0]] === true)
					.forEach((obj) => {
						const secondKey = Object.keys(obj)[1];
						const newObj = {
							category,
							id: obj[secondKey],
						};
						const exists = transformedPermissionsData.some(
							(item) =>
								item.category === newObj.category && item.id === newObj.id
						);
						if (!exists) {
							transformedPermissionsData.push(newObj);
						}
					});
			});
		});

		this.roleForm.setControl(
			'permissions',
			new FormControl(transformedPermissionsData)
		);

		this.roleService.addRole(this.roleForm).then((res) => {
			if (res.status) {
				this.router.navigate([URL_ROUTES.LIST_ROLE]);
			} else {
				console.log('error');
			}
		});
	}

	changeAccountData(accountId: any) {
		this.permissionParams.accountId = accountId;
		this.listPermissionsAPI(this.permissionParams);
	}

	listPermissionsAPI(params: any) {
		this.roleService.listPermissions(params).subscribe((res) => {
			if (res.status) {
				this.permissionsData = res.data.permissions;
				this.initialisePermissions();
			}
		});
	}
}
