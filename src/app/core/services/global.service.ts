import { Injectable } from '@angular/core';

import { StorageService } from './storage.service';

import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { StorageType } from 'src/app/constants/storage-type';
import { DecodedTokenI } from '../interface/decode-token';
import { IAPIResponse } from '../interface/api-response';
import { URL_ROUTES } from 'src/app/constants/routing';
import Swal from 'sweetalert2';
@Injectable({
	providedIn: 'root',
})
export class GlobalService {
	accessToken!: string | null;
	decodeToken!: DecodedTokenI;
	userRole!: string;
	reportUrl!: string;
	public isSidenavOpened: BehaviorSubject<boolean> =
		new BehaviorSubject<boolean>(false);
	constructor(private router: Router) {}
	handleSuccessService(result: IAPIResponse, showToast = true) {
		if (showToast) {
			if (result.status) {
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: result.message,
					toast: true,
					position: 'top-end',
					showConfirmButton: false,
					timer: 2000,
				});
				return true;
			}
		}
		if (!result.status) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: result.message,
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 2000,
			});
			return true;
		}
	}

	getDecodeToken() {
		const accessToken = StorageService.get(StorageType.ACCESS_TOKEN);
		if (accessToken) return JSON.parse(atob(accessToken.split('.')[1]));
		else this.router.navigateByUrl('');
	}

	getUserRole(value: string) {
		const accessToken = StorageService.get(StorageType.ACCESS_TOKEN);
		let decodeToken;
		if (accessToken) {
			decodeToken = JSON.parse(atob(accessToken.split('.')[1]));
		} else {
			this.router.navigateByUrl('');
		}
		let userRole = decodeToken.role.name.toLowerCase();
		let permissions = decodeToken.role.permissions;
		let account = decodeToken.account;

		if (userRole != 'super-admin' && userRole != 'client-admin') {
			userRole = 'user';
		}
		switch (value) {
			case 'decodeToken':
				return decodeToken;
			case 'userRole':
				return userRole;
			case 'permissions':
				return permissions;
			case 'account':
				return account;
		}
	}

	checkForPermissionAndRoute(permission: any, routerLink: string) {
		let userPermission = this.getUserRole('permissions');
		let permissionName = userPermission.map((per: any) => per.name);
		if (permissionName.includes(permission)) {
			this.router.navigateByUrl(routerLink);

			return true;
		} else {
			this.router.navigateByUrl(URL_ROUTES.ACCESS_DENIED);
			return false;
		}
	}

	checkForPermission(permission: any) {
		let userPermission = this.getUserRole('permissions');
		let permissionName = userPermission.map((per: any) => per.name);
		if (permissionName.includes(permission)) {
			return true;
		} else {
			return false;
		}
	}

	getUserInfo() {
		const accessToken = StorageService.get(StorageType.ACCESS_TOKEN);
		let decodeToken: DecodedTokenI;
		if (accessToken) {
			decodeToken = JSON.parse(atob(accessToken.split('.')[1]));
		} else {
			this.router.navigateByUrl('');
		}
		let role = decodeToken.role.name;
		let userName = decodeToken.username;
		let name = decodeToken.name;
		let account = decodeToken?.account?.name;
		let email = decodeToken.email;

		return { role, userName, name, account, email };
	}
}
