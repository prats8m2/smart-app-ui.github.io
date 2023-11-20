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
import { GlobalService } from 'src/app/core/services/global.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../accounts/service/account.service';
import { StaffService } from '../service/staff.service';

@Component({
	selector: 'app-view-staff',
	templateUrl: './view-staff.component.html',
	styleUrls: ['./view-staff.component.scss'],
})
export class ViewStaffComponent implements OnInit {
	isProduction = environment.production;
	public staffForm: FormGroup = this.formBuilder.group({
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
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showListRole: boolean = this.globalService.checkForPermission('LIST-ROLE');

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		public accountService: AccountService,
		private activatedRoute: ActivatedRoute,
		private staffService: StaffService
	) {}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((params) => {
			let staffId = params['id'];
			this.staffService.viewStaff(staffId).then((res) => {
				if (res.status === true) {
					this.staffForm.disable();
					this.staffForm.get('account')?.patchValue(res.data.account.name);
					this.staffForm.get('role')?.patchValue(res.data.role.name);
					this.staffForm.get('firstName')?.patchValue(res.data.firstName);
					this.staffForm.get('lastName')?.patchValue(res.data.lastName);
					this.staffForm.get('email')?.patchValue(res.data.email);
					this.staffForm.get('mobile')?.patchValue(res.data.mobile);
					this.staffForm.get('username')?.patchValue(res.data.username);
					this.staffForm.get('password')?.patchValue('Pass@1234');
					const siteName = res.data.sites.map((site) => site.name);
					this.staffForm.get('site')?.patchValue(siteName);
				}
			});
		});
	}

	getPermissionLabel(permissionName: string): string {
		return permissionName.split('-')[0];
	}

	routeToListStaff() {
		this.router.navigateByUrl(URL_ROUTES.LIST_STAFF);
	}
}
