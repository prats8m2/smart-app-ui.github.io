import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { USER } from 'src/app/constants/api';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	constructor(private http: HttpClient, private globalService: GlobalService) {}

	userRole = this.globalService.getUserRole('userRole');

	addUser(userForm: FormGroup) {
		const {
			firstName,
			lastName,
			username,
			email,
			password,
			accountName,
			status,
			mobile,
		} = userForm.getRawValue();

		return this.http
			.post(USER.ADD_USER, {
				email: email,
				username: username,
				password: password,
				accountName: accountName,
				firstName: firstName,
				lastName: lastName,
				mobile,
				status: status ? 1 : 0,
			})
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	listUser(params: IParams): Observable<any> {
		return this.http
			.get(USER.LIST_USER + `/${params.pageNumber}/${params.limit}`)
			.pipe(
				map((response: any) => {
					const result = JSON.parse(JSON.stringify(response));
					return result;
				})
			);
	}

	deleteAccount(id: number) {
		return this.http
			.delete(USER.DELETE_USER + id.toString())
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	viewUser(id: any) {
		return this.http
			.get(USER.VIEW_USER + id)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}
	updateUser(userForm: any) {
		const {
			id,
			firstName,
			lastName,
			username,
			email,
			password,
			accountName,
			status,
		} = userForm.value;

		return this.http
			.put(USER.UPDATE_USER, {
				id: id,
				email: email,
				username: username,
				password: password,
				accountName: accountName,
				firstName: firstName,
				lastName: lastName,
				status: status ? 1 : 0,
			})
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	listAccounts(params: IParams) {
		return this.http
			.get(USER.LIST_ACCOUNTS + `/${params.pageNumber}/${params.limit}`)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}

	listCountries(): Observable<any> {
		return this.http.get(USER.LIST_COUNTRIES).pipe(
			map((response: any) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			})
		);
	}

	listCurrencies(): Observable<any> {
		return this.http.get(USER.LIST_CURRENCIES).pipe(
			map((response: any) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			})
		);
	}

	listStates(code: any): Observable<any> {
		return this.http.get(USER.LIST_STATES + code).pipe(
			map((response: any) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			})
		);
	}
}
