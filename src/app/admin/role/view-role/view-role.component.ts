import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountService } from '../../accounts/service/account.service';
import { SiteService } from '../../site/service/site.service';
import { URL_ROUTES } from 'src/app/constants/routing';
import { ROLE_NAME_VALIDATION } from 'src/app/constants/validations';
import { RoleService } from '../service/role.service';

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
		permissions: this.formBuilder.group({}),
	});
	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		public accountService: AccountService,
		private activatedRoute: ActivatedRoute,
		private roleService: RoleService
	) {}
	ngOnInit(): void {
		this.getRole();
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
					console.log(res.data);
					this.roleForm.get('account')?.patchValue(res.data.account.name);
					this.roleForm.get('roleName')?.patchValue(res.data.name);
					this.roleForm.get('isDefault')?.patchValue(res.data.default);
				}
			});
		});
	}
}
