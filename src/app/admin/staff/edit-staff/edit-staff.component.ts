import { Component, OnInit } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	Validators,
	FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import {
	FIRST_NAME_VALIDATION,
	LAST_NAME_VALIDATION,
	USER_NAME_VALIDATION,
	EMAIL_VALIDATION,
	PASSWORD_VALIDATION,
	PHONE_VALIDATION,
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
import { RoleService } from '../../role/service/role.service';
import { SiteService } from '../../site/service/site.service';
import { StaffService } from '../service/staff.service';

@Component({
	selector: 'app-edit-staff',
	templateUrl: './edit-staff.component.html',
	styleUrls: ['./edit-staff.component.scss'],
})
export class EditStaffComponent implements OnInit {
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
		private activatedRoute: ActivatedRoute
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
		this.getStaff();
	}
	getStaff() {
		this.activatedRoute.params.subscribe((params) => {
			let staffId = params['id'];
			this.staffService.viewStaff(staffId).then((res) => {
				if (res.status === true) {
					this.staffForm.get('account')?.patchValue(res.data.account.id);
					this.staffForm.get('role')?.patchValue(res.data.role.name);
					this.staffForm.get('firstName')?.patchValue(res.data.firstName);
					this.staffForm.get('lastName')?.patchValue(res.data.lastName);
					this.staffForm.get('email')?.patchValue(res.data.email);
					this.staffForm.get('mobile')?.patchValue(res.data.mobile);
					this.staffForm.get('username')?.patchValue(res.data.username);
					this.staffForm.get('password')?.patchValue('Pass@1234');
					const siteName = res.data.sites.map((site) => site.name);
					this.staffForm.get('site')?.patchValue(siteName);

					console.log(this.staffForm.get('site').value);
				}
			});
		});
		console.log(this.staffForm.value);
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
		this.router.navigateByUrl(URL_ROUTES.LIST_STAFF);
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
		this.siteParams.accountId = accountId;
		this.roleParams.accountId = accountId;
		this.staffForm.get('account').patchValue(accountId);
		this.listSiteAPI(this.siteParams);
		this.listRoleAPI(this.roleParams);
	}

	changeRoleData(roleId: any) {
		this.staffForm.get('role').patchValue(roleId);
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
			} else {
				console.log('error');
			}
		});
	}

	toggle(): void {
		const statusControl = this.staffForm.get('status') as FormControl;
		statusControl.setValue(!statusControl.value);
	}
	getValue() {
		console.log(this.staffForm.value);
	}
}
