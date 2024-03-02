import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import {
	ROOM_NAME_VALIDATION,
	TABLE_NAME_VALIDATION,
} from 'src/app/constants/validations';
import {
	hasError,
	isValid,
	isTouchedAndValid,
	isTouched,
} from 'src/app/core/helpers/form-error';
import { errorMessages } from 'src/app/core/helpers/form-error-message';
import { IParams } from 'src/app/core/interface/params';
import { DialogService } from 'src/app/core/services/dialog.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../accounts/service/account.service';
import { DeviceService } from '../../device/service/device.service';
import { RoomService } from '../../room/services/room.service';
import { SiteService } from '../../site/service/site.service';
import { TableService } from '../services/table.service';

@Component({
	selector: 'app-edit-table',
	templateUrl: './edit-table.component.html',
	styleUrls: ['./edit-table.component.scss'],
})
export class EditTableComponent implements OnInit {
	isProduction = environment.production;

	public tableForm: FormGroup = this.formBuilder.group({
		id: [null],
		account: [null],
		site: [null],
		device: [null],
		status: [null],
		tableName: [null, TABLE_NAME_VALIDATION],
		occupied: [null],
	});

	deviceParams: IParams = {
		siteId: null,
		limit: 100,
		pageNumber: 1,
	};

	siteParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showListRole: boolean = this.globalService.checkForPermission('LIST-ROLE');
	showListTable: boolean = this.globalService.checkForPermission('LIST-TABLE');
	showEditTable: boolean =
		this.globalService.checkForPermission('UPDATE-TABLE');
	showDeleteTable: boolean =
		this.globalService.checkForPermission('DELETE-TABLE');

	deviceList: any = [];
	siteList: any = [];
	selectedDevice: any;
	roomSiteId: any;
	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		public accountService: AccountService,
		private activatedRoute: ActivatedRoute,
		private dialogService: DialogService,
		private roomService: RoomService,
		private deviceService: DeviceService,
		private siteService: SiteService,
		private tableService: TableService
	) {}

	ngOnInit(): void {
		this.getTable();
	}

	getTable() {
		this.activatedRoute.params.subscribe((params) => {
			let tableId = params['id'];
			this.tableService.viewTable(tableId).then((res) => {
				if (res.status) {
					let data = res.data;
					let occupiedStatus = data?.occupied === 1 ? true : false;
					let tableStatus = data?.status === 1 ? true : false;
					this.tableForm.patchValue({
						id: tableId,
						account: data?.site?.account?.name,
						site: data?.site?.name,
						tableName: data?.name,
						status: tableStatus,
						occupied: occupiedStatus,
						device: data?.device?.id,
					});
					this.tableForm.get('account').disable();
					this.tableForm.get('site').disable();
					this.roomSiteId = data?.site?.id;
					this.listDeviceAPI(data?.site?.id);
					this.selectedDevice = data?.device;
				}
			});
		});
	}

	//form validation function
	isError(formControlName: string, errorType: string): boolean {
		return hasError(this.tableForm, formControlName, errorType);
	}

	showError(formControlName: string): boolean {
		return isValid(this.tableForm, formControlName);
	}

	showSuccess(formControlName: string): boolean {
		return isTouchedAndValid(this.tableForm, formControlName);
	}

	formTouched(formControlName: string): boolean {
		return isTouched(this.tableForm, formControlName);
	}

	errorMessage(formControlName: string, errorType: string): string {
		return errorMessages[formControlName][errorType];
	}

	routeToListTable() {
		if (!this.tableForm.dirty) {
			this.router.navigateByUrl(URL_ROUTES.LIST_TABLE);
		} else {
			this.dialogService.openBackConfirmDialog().then((result) => {
				if (result.value) {
					this.router.navigateByUrl(URL_ROUTES.LIST_TABLE);
				}
			});
		}
	}

	listDeviceAPI(siteId: any) {
		this.deviceParams.siteId = siteId;
		this.deviceService
			.listAvailableDevice(this.deviceParams)
			.subscribe((res: any) => {
				if (res.status) {
					this.deviceList = [...res.data.devices];
					this.deviceList.push(this.selectedDevice);
				}
			});
	}

	updateTable() {
		this.tableService
			.updateTable(this.tableForm, this.roomSiteId)
			.then((res: any) => {
				if (res.status) {
					this.routeToListTable();
				} else {
					console.log('error');
				}
			});
	}
}
