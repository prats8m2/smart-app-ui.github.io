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
	showEditRole: boolean = this.globalService.checkForPermission('UPDATE-ROLE');
	showDeleteRole: boolean =
		this.globalService.checkForPermission('DELETE-ROLE');

	selectedRole: any = [];
	disableEditRole: boolean = false;
	disableDeleteRole: boolean = false;

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
	}

	routeToListRole() {
		this.router.navigateByUrl(URL_ROUTES.LIST_ROLE);
	}

	getRole() {
		this.activatedRoute.params.subscribe((params) => {
			let roleId = params['id'];
			this.roleForm.value.id = params['id'];
			this.roleService.viewRole(roleId).then((res) => {
				if (res.status === true) {
					this.roleForm.disable();
					this.roleForm.get('account')?.patchValue(res.data.account.name);
					this.roleForm.get('roleName')?.patchValue(res.data.name);
					this.roleForm.get('isDefault')?.patchValue(res.data.default);
					this.permissionParams.accountId = res.data.account.id;
					this.selectedRole = res.data.permissions;
					this.disableEditRole = res.data.default;
					this.disableDeleteRole = res.data.default;
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
		this.patchPermissionsData(this.selectedRole);
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

	deletRole() {
		let roleId: any;
		this.activatedRoute.params.subscribe((params) => {
			roleId = params['id'];
		});
		this.dialogService.openConfirmDialog().then((result) => {
			if (result.value) {
				this.roleService.deleteRole(roleId).then((res: any) => {
					if (res.status) {
						this.router.navigateByUrl(URL_ROUTES.LIST_ROLE);
					}
				});
			}
		});
	}

	routeToEditRole() {
		let roleId: any;
		this.activatedRoute.params.subscribe((params) => {
			roleId = params['id'];
		});
		this.router.navigateByUrl(URL_ROUTES.EDIT_ROLE + '/' + roleId);
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
		userPermissionsControl.disable();
	}
}
