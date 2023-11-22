import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { ROLE_NAME_VALIDATION } from 'src/app/constants/validations';
import { IParams } from 'src/app/core/interface/params';
import { AccountService } from '../../accounts/service/account.service';
import { RoleService } from '../service/role.service';

@Component({
	selector: 'app-edit-role',
	templateUrl: './edit-role.component.html',
	styleUrls: ['./edit-role.component.scss'],
})
export class EditRoleComponent implements OnInit {
	public roleForm: FormGroup = this.formBuilder.group({
		id: [''],
		account: [null],
		roleName: ['', ROLE_NAME_VALIDATION],
		isDefault: [''],
		userPermissions: this.formBuilder.group({}),
	});

	permissionsData: any = {};
	permissionParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};
	userPermissionsData: any = [];
	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		public accountService: AccountService,
		private activatedRoute: ActivatedRoute,
		private roleService: RoleService
	) {}
	ngOnInit(): void {
		this.getRole();
		this.listPermissionsAPI(this.permissionParams);
	}

	routeToListRole() {
		this.router.navigateByUrl(URL_ROUTES.LIST_ROLE);
	}

	getRole() {
		this.activatedRoute.params.subscribe((params) => {
			let roleId = params['id'];
			this.roleForm.get('id').patchValue(roleId);
			this.roleService.viewRole(roleId).then((res) => {
				if (res.status === true) {
					this.roleForm.get('account').disable();
					this.roleForm.get('isDefault').disable();
					this.roleForm.get('account')?.patchValue(res.data.account.name);
					this.roleForm.get('roleName')?.patchValue(res.data.name);
					this.roleForm.get('isDefault')?.patchValue(res.data.default);
					this.permissionParams.accountId = res.data.account.id;
					this.userPermissionsData = res.data.permissions;
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

		this.patchPermissionsData(this.userPermissionsData);
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

	updateRole() {
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
		this.roleService.updateRole(this.roleForm).then((res) => {
			if (res.status) {
				this.router.navigate([URL_ROUTES.LIST_ROLE]);
			} else {
				console.log('error');
			}
		});
	}

	patchPermissionsData(data: any[]) {
		const userPermissionsControl = this.roleForm.get(
			'userPermissions'
		) as FormGroup;
		data.forEach((permission) => {
			const category = permission.category;
			const formArray = userPermissionsControl.get(category) as FormArray;
			const formGroupIndex = formArray.controls.findIndex(
				(control: FormGroup) => {
					return control.get('id').value === permission.id;
				}
			);
			if (formGroupIndex !== -1) {
				const formGroup = formArray.controls[formGroupIndex] as FormGroup;
				formGroup.get(permission.name).patchValue(true);
			}
		});
	}
}
