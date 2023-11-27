import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { DialogService } from 'src/app/core/services/dialog.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../accounts/service/account.service';
import { RoomService } from '../../room/services/room.service';
import { TableService } from '../services/table.service';

@Component({
	selector: 'app-view-table',
	templateUrl: './view-table.component.html',
	styleUrls: ['./view-table.component.scss'],
})
export class ViewTableComponent implements OnInit {
	isProduction = environment.production;

	public tableForm: FormGroup = this.formBuilder.group({
		account: [null],
		site: [null],
		device: [null],
		status: [null],
		tableName: [null],
		occupied: [null],
		deviceStatus: [null],
	});
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	// showListRole: boolean = this.globalService.checkForPermission('LIST-TAB');
	showListTable: boolean = this.globalService.checkForPermission('LIST-TABLE');
	showEditTable: boolean =
		this.globalService.checkForPermission('UPDATE-TABLE');
	showDeleteTable: boolean =
		this.globalService.checkForPermission('DELETE-TABLE');

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		public accountService: AccountService,
		private activatedRoute: ActivatedRoute,
		private dialogService: DialogService,
		private tableService: TableService
	) {}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((params) => {
			let tableId = params['id'];
			this.tableService.viewTable(tableId).then((res) => {
				if (res.status) {
					this.tableForm.disable();
					let data = res.data;
					this.tableForm.patchValue({
						site: data.site.name,
						device: data?.device ? data?.device?.code : '-',
						status: data?.status,
						account: data?.site?.account?.name,
						tableName: data?.name,
					});

					let occupiedStatus = data?.occupied === 1 ? true : false;
					this.tableForm.get('occupied').patchValue(occupiedStatus);
				}
			});
		});
	}
	routeToListTable() {
		this.router.navigateByUrl(URL_ROUTES.LIST_TABLE);
	}

	deleteTable() {
		let tableId: any;
		this.activatedRoute.params.subscribe((params) => {
			tableId = params['id'];
		});
		this.dialogService.openConfirmDialog().then((result) => {
			if (result.value) {
				//call delete table API
				this.tableService.deleteTable(tableId).then((res: any) => {
					if (res.status) {
						this.router.navigateByUrl(URL_ROUTES.LIST_TABLE);
					}
				});
			}
		});
	}

	routeToEditTable() {
		let tableId: any;
		this.activatedRoute.params.subscribe((params) => {
			tableId = params['id'];
		});
		this.router.navigateByUrl(URL_ROUTES.EDIT_TABLE + '/' + tableId);
	}
}
