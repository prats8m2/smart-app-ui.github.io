import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { ROLE, STAFF } from 'src/app/constants/api';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';

@Injectable({
	providedIn: 'root',
})
export class StaffService {
	constructor(private http: HttpClient, private globalService: GlobalService) {}

	listStaff(params: IParams): Observable<any> {
		return this.http
			.get(
				STAFF.LIST_STAFF +
					`/${params.roleId}/${params.pageNumber}/${params.limit}`
			)
			.pipe(
				map((response: any) => {
					const result = JSON.parse(JSON.stringify(response));
					return result;
				})
			);
	}

	addStaff(staffForm: FormGroup) {
		const {
			account,
			site,
			role,
			status,
			firstName,
			lastName,
			username,
			email,
			password,
			mobile,
		} = staffForm.value;

		return this.http
			.post(STAFF.ADD_STAFF, {
				accountId: account,
				firstName: firstName,
				lastName: lastName,
				email: email,
				username: username,
				password: password,
				mobile: mobile,
				role: role,
				sites: site,
			})
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	viewStaff(staffId: any) {
		return this.http
			.get(STAFF.VIEW_STAFF + staffId)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	updateRole(roleForm: any) {
		const { id, account, roleName, permissions } = roleForm.value;

		return this.http
			.put(ROLE.UPDATE_ROLE, {
				id: id,
				accountId: account,
				name: roleName,
				permissions: permissions,
			})
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	deleteStaff(staffId: number) {
		return this.http
			.delete(STAFF.DELETE_STAFF + staffId.toString())
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	listPermissions(params: IParams) {
		return this.http
			.get(
				ROLE.LIST_PERMISSIONS +
					`/${params.accountId}/${params.pageNumber}/${params.limit}`
			)
			.pipe(
				map((response: any) => {
					const result = JSON.parse(JSON.stringify(response));
					return result;
				})
			);
	}
}
