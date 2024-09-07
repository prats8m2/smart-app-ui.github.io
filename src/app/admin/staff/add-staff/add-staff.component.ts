import { Component, OnInit } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	Validators,
	FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import {
	EMAIL_VALIDATION,
	FIRST_NAME_VALIDATION,
	LAST_NAME_VALIDATION,
	PASSWORD_VALIDATION,
	PHONE_VALIDATION,
	USER_NAME_VALIDATION,
} from 'src/app/constants/validations';
import {
	hasError,
	isValid,
	isTouchedAndValid,
	isTouched,
} from 'src/app/core/helpers/form-error';
import { errorMessages } from 'src/app/core/helpers/form-error-message';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../accounts/service/account.service';
import { SiteService } from '../../site/service/site.service';
import { RoleService } from '../../role/service/role.service';
import { StaffService } from '../service/staff.service';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
	selector: 'app-add-staff',
	templateUrl: './add-staff.component.html',
	styleUrls: ['./add-staff.component.scss'],
})
export class AddStaffComponent implements OnInit {
	isProduction = environment.production;
	public staffForm: FormGroup;
	accountList: any = [];
	siteList: any = [];
	roleList: any = [];
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showListRole: boolean = this.globalService.checkForPermission('LIST-ROLE');
	accountParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};

	siteParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};

	roomParams: IParams = {
		siteId: null,
		limit: 100,
		pageNumber: 1,
	};

	roleParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		public accountService: AccountService,
		private siteServices: SiteService,
		private roleService: RoleService,
		private staffService: StaffService,
		private dialogService: DialogService
	) {
		if (this.isProduction) {
			this.staffForm = this.formBuilder.group({
				account: [null],
				site: [[], Validators.required],
				role: [null, Validators.required],
				status: [true],
				firstName: ['', FIRST_NAME_VALIDATION],
				lastName: ['', LAST_NAME_VALIDATION],
				username: [null, USER_NAME_VALIDATION],
				email: ['', EMAIL_VALIDATION],
				password: ['', PASSWORD_VALIDATION],
				mobile: ['', PHONE_VALIDATION],
			});
		} else {
			const randomNumber = Math.floor(1000 + Math.random() * 9000);
			this.staffForm = this.formBuilder.group({
				account: [null],
				site: [[], Validators.required],
				role: [null, Validators.required],
				status: [true],
				firstName: ['John' + randomNumber, FIRST_NAME_VALIDATION],
				lastName: ['Doe' + randomNumber, LAST_NAME_VALIDATION],
				username: ['john-' + randomNumber, USER_NAME_VALIDATION],
				email: ['john-' + randomNumber + '@yopmail.com', EMAIL_VALIDATION],
				password: ['Pass@1234', PASSWORD_VALIDATION],
				mobile: ['9876543210', PHONE_VALIDATION],
			});
		}
	}

	ngOnInit(): void {
		if (this.showListAccount) {
			this.accountService.listUser(this.accountParams).subscribe((res) => {
				if (res.status) {
					this.accountList = [...res.data.users];
					if (this.accountList.length) {
						this.siteParams.accountId = this.accountList[0].account.id;
						this.roleParams.accountId = this.accountList[0].account.id;
						this.listSiteAPI(this.siteParams);
					}
				}
			});
		} else {
			this.listSiteAPI(this.siteParams);
		}
		this.staffForm.get('status').disable();
		this.globalService.formControlValuesChanged(this.staffForm);
	}
	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.siteList = [...res.data.sites];
				this.listRoleAPI(this.roleParams);
			}
		});
	}

	listRoleAPI(params: IParams) {
		this.roleService.listRoles(params).subscribe((res) => {
			if (res.status) {
				this.roleList = [...res.data.roles];
			}
		});
	}

	getPermissionLabel(permissionName: string): string {
		return permissionName.split('-')[0];
	}

	routeToListStaff() {
		if (!this.staffForm.dirty) {
			this.router.navigateByUrl(URL_ROUTES.LIST_STAFF);
		} else {
			this.dialogService.openBackConfirmDialog().then((result) => {
				if (result.value) {
					this.router.navigateByUrl(URL_ROUTES.LIST_STAFF);
					this.globalService.enableSideNavRouting();
				}
			});
		}
	}

	//form validation function
	isError(formControlName: string, errorType: string): boolean {
		return hasError(this.staffForm, formControlName, errorType);
	}

	showError(formControlName: string): boolean {
		return isValid(this.staffForm, formControlName);
	}

	showSuccess(formControlName: string): boolean {
		return isTouchedAndValid(this.staffForm, formControlName);
	}

	formTouched(formControlName: string): boolean {
		return isTouched(this.staffForm, formControlName);
	}

	errorMessage(formControlName: string, errorType: string): string {
		return errorMessages[formControlName][errorType];
	}

	changeAccountData(accountId: any) {
		if (accountId) {
			this.siteParams.accountId = accountId;
			this.roleParams.accountId = accountId;
			this.staffForm.get('account').patchValue(accountId);
			this.clearSiteData();
			this.listSiteAPI(this.siteParams);
		}
	}

	changeRoleData(roleId: any) {
		if (roleId) {
			this.staffForm.get('role').patchValue(roleId);
		}
	}

	clearSiteData() {
		this.staffForm.get('site').patchValue([]);
	}

	addStaff() {
		const selectedSiteIds = this.staffForm.get('site').value;

		const selectedSiteObjects = selectedSiteIds.map((id: number) => ({
			id,
		}));
		this.staffForm.get('site').patchValue(selectedSiteObjects);
		this.staffService.addStaff(this.staffForm).then((res) => {
			if (res.status) {
				this.router.navigate([URL_ROUTES.LIST_STAFF]);
				this.globalService.enableSideNavRouting();
			} else {
				console.log('error');
			}
		});
	}

	toggle(): void {
		const statusControl = this.staffForm.get('status') as FormControl;
		statusControl.setValue(!statusControl.value);
	}
}
