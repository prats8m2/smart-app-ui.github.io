import { Component, OnInit } from '@angular/core';
import {
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../../accounts/service/account.service';
import { URL_ROUTES } from 'src/app/constants/routing';
import { ROLE_NAME_VALIDATION } from 'src/app/constants/validations';
import { RoleService } from '../service/role.service';
import { IParams } from 'src/app/core/interface/params';
import { DialogService } from 'src/app/core/services/dialog.service';
import { GlobalService } from 'src/app/core/services/global.service';

@Component({
	selector: 'app-view-role',
	templateUrl: './view-role.component.html',
	styleUrls: ['./view-role.component.scss'],
})
export class ViewRoleComponent implements OnInit {
	public roleForm: FormGroup = this.formBuilder.group({
		account: [null],
		roleName: ['', ROLE_NAME_VALIDATION],
		isDefault: [''],
		userPermissions: this.formBuilder.group({}),
	});

	showListRole: boolean = this.globalService.checkForPermission('LIST-ROLE');
	showDeleteRole: boolean =
		this.globalService.checkForPermission('DELETE-ROLE');

	gg = [
		{
			id: 1,
			name: 'ADD-ACCOUNT',
			category: 'ACCOUNT',
			createdOn: '2023-11-17T15:35:34.935Z',
		},
		{
			id: 2,
			name: 'UPDATE-ACCOUNT',
			category: 'ACCOUNT',
			createdOn: '2023-11-17T15:35:34.963Z',
		},
		{
			id: 11,
			name: 'ADD-ROLE',
			category: 'ROLE',
			createdOn: '2023-11-17T15:35:35.026Z',
		},
		{
			id: 12,
			name: 'UPDATE-ROLE',
			category: 'ROLE',
			createdOn: '2023-11-17T15:35:35.032Z',
		},
	];
	permissionsData: any = {};
	permissionParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};
	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		public accountService: AccountService,
		private activatedRoute: ActivatedRoute,
		private roleService: RoleService,
		private dialogService: DialogService,
		private globalService: GlobalService
	) {}
	ngOnInit(): void {
		this.getRole();
		this.listPermissionsAPI(this.permissionParams);

		this.patchPermissionValues();
	}

	routeToListRole() {
		this.router.navigateByUrl(URL_ROUTES.LIST_ROLE);
	}

	getRole() {
		this.activatedRoute.params.subscribe((params) => {
			let roleId = params['id'];
			console.log("params['id'];:", params);
			this.roleForm.value.id = params['id'];
			this.roleService.viewRole(roleId).then((res) => {
				if (res.status === true) {
					this.roleForm.disable();
					this.roleForm.get('account')?.patchValue(res.data.account.name);
					this.roleForm.get('roleName')?.patchValue(res.data.name);
					this.roleForm.get('isDefault')?.patchValue(res.data.default);
					this.permissionParams.accountId = res.data.account.id;
					console.log(res.data.permissions);
					console.log(this.permissionParams);
				}
			});
		});
	}

	listPermissionsAPI(params: any) {
		this.roleService.listPermissions(params).subscribe((res) => {
			if (res.status) {
				this.permissionsData = res.data.permissions;
				this.initialisePermissions();
			}
		});
	}

	initialisePermissions() {
		const userPermissionsArray = this.roleForm.get(
			'userPermissions'
		) as FormArray;

		Object.keys(this.permissionsData).forEach((key: any) => {
			const formArray = this.permissionsData[key].map((permission) => {
				return this.formBuilder.group({
					[permission.name]: new FormControl(false),
					id: permission.id,
				});
			});

			userPermissionsArray.setControl(key, this.formBuilder.array(formArray));
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

	patchPermissionValues() {
		const userPermissionsArray = this.roleForm.get(
			'userPermissions'
		) as FormArray;

		this.gg.forEach((patch) => {
			const category = this.getPermissionCategoryById(patch.id);

			if (category !== null) {
				const formArray = userPermissionsArray.get('ACCOUNT') as FormArray;
				console.log(formArray);

				if (formArray) {
					const control = formArray.controls.find((c) => c.get(patch.name));

					if (control) {
						const permissionControl = control.get(patch.name) as FormControl;
						permissionControl.setValue(true);
					}
				}
			}
		});
	}

	getPermissionCategoryById(id: number): string {
		const permission = this.gg.find((p) => p.id === id);
		if (permission) {
			return permission.category;
		} else {
			console.error(`Category not found for permission with id ${id}`);
			return null;
		}
	}

	deletRole() {
		let roleId: any;
		this.activatedRoute.params.subscribe((params) => {
			roleId = params['id'];
		});
		this.dialogService.openConfirmDialog().then((result) => {
			if (result.value) {
				//call delete role API
				this.roleService.deleteRole(roleId).then((res: any) => {
					if (res.status) {
						this.router.navigateByUrl(URL_ROUTES.LIST_ROLE);
					}
				});
			}
		});
	}
}
