import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	Validators,
	FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import {
	FIRST_NAME_VALIDATION,
	LAST_NAME_VALIDATION,
	USER_NAME_VALIDATION,
	EMAIL_VALIDATION,
	PASSWORD_VALIDATION,
	PHONE_VALIDATION,
	ROOM_NAME_VALIDATION,
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
import { StaffService } from '../../staff/service/staff.service';

@Component({
	selector: 'app-add-room',
	templateUrl: './add-room.component.html',
	styleUrls: ['./add-room.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class AddRoomComponent implements OnInit {
	isProduction = environment.production;
	public staffForm: FormGroup;
	accountList: any = [];
	siteList: any = [];
	roleList: any = [];
	wifiList: any = [];
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
		private staffService: StaffService
	) {
		if (this.isProduction) {
			this.staffForm = this.formBuilder.group({
				account: [null],
				site: [null, Validators.required],
				wifi: [null, Validators.required],
				status: [true],
				roomName: ['', ROOM_NAME_VALIDATION],
			});
		} else {
			const randomNumber = Math.floor(1000 + Math.random() * 9000);
			this.staffForm = this.formBuilder.group({
				account: [null],
				site: [null, Validators.required],
				wifi: [null, Validators.required],
				status: [true],
				roomName: ['Room-' + randomNumber, ROOM_NAME_VALIDATION],
			});
		}
	}

	ngOnInit(): void {
		if (this.showListAccount) {
			this.accountService.listUser(this.accountParams).subscribe((res) => {
				if (res.status) {
					this.accountList = [...res.data.users];
					this.siteParams.accountId = this.accountList[0].account.id;
					this.roleParams.accountId = this.accountList[0].account.id;
					this.listSiteAPI(this.siteParams);
				}
			});
		} else {
			this.listSiteAPI(this.siteParams);
		}
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

	routeToListRoom() {
		this.router.navigateByUrl(URL_ROUTES.LIST_ROOM);
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

	addRoom() {
		// this.staffService.addStaff(this.staffForm).then((res) => {
		// 	if (res.status) {
		// 		this.router.navigate([URL_ROUTES.LIST_STAFF]);
		// 	} else {
		// 		console.log('error');
		// 	}
		// });
		console.log(this.staffForm.value);
	}

	toggle(): void {
		const statusControl = this.staffForm.get('status') as FormControl;
		statusControl.setValue(!statusControl.value);
	}
	getValue() {
		console.log(this.staffForm.value);
	}

	changeSiteData(siteId: any) {
		this.siteServices.viewSite(siteId).then((res) => {
			console.log(res.data.wifi);
			this.wifiList = [...res.data.wifi];
		});
	}
}
