import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { GlobalService } from 'src/app/core/services/global.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../accounts/service/account.service';
import { StaffService } from '../service/staff.service';
import { DialogService } from 'src/app/core/services/dialog.service';

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
		status: [null],
		firstName: [''],
		lastName: [''],
		username: [null],
		email: [''],
		password: [''],
		mobile: [''],
	});
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showListRole: boolean = this.globalService.checkForPermission('LIST-ROLE');
	showListStaff: boolean = this.globalService.checkForPermission('LIST-STAFF');
	showEditStaff: boolean =
		this.globalService.checkForPermission('UPDATE-STAFF');
	showDeleteStaff: boolean =
		this.globalService.checkForPermission('DELETE-STAFF');

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		public accountService: AccountService,
		private activatedRoute: ActivatedRoute,
		private staffService: StaffService,
		private dialogService: DialogService
	) {}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((params) => {
			let staffId = params['id'];
			this.staffService.viewStaff(staffId).then((res) => {
				if (res.status === true) {
					const {
						account,
						role,
						firstName,
						lastName,
						email,
						mobile,
						username,
						sites,
					} = res.data;
					const staffForm = this.staffForm;
					staffForm.disable();
					staffForm.patchValue({
						account: account.name,
						role: role.name,
						firstName,
						lastName,
						email,
						mobile,
						username,
						password: 'Pass@1234',
						site: sites.map((site) => site.name),
					});
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

	deleteStaff() {
		let staffId: any;
		this.activatedRoute.params.subscribe((params) => {
			staffId = params['id'];
		});
		this.dialogService.openDeleteConfirmDialog().then((result) => {
			if (result.value) {
				//call delete site API
				this.staffService.deleteStaff(staffId).then((res: any) => {
					if (res.status) {
						this.router.navigateByUrl(URL_ROUTES.LIST_STAFF);
					}
				});
			}
		});
	}

	routeToEditStaff() {
		let staffId: any;
		this.activatedRoute.params.subscribe((params) => {
			staffId = params['id'];
		});
		this.router.navigateByUrl(URL_ROUTES.EDIT_STAFF + '/' + staffId);
	}
}
