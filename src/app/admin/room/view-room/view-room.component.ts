import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { DialogService } from 'src/app/core/services/dialog.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../accounts/service/account.service';
import { RoomService } from '../services/room.service';

@Component({
	selector: 'app-view-room',
	templateUrl: './view-room.component.html',
	styleUrls: ['./view-room.component.scss'],
})
export class ViewRoomComponent implements OnInit {
	isProduction = environment.production;

	public roomForm: FormGroup = this.formBuilder.group({
		account: [null],
		site: [null],
		wifi: [[]],
		device: [null],
		status: [null],
		roomName: [null],
		occupied: [null],
		deviceStatus: [null],
	});
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showListRole: boolean = this.globalService.checkForPermission('LIST-ROLE');
	showListRoom: boolean = this.globalService.checkForPermission('LIST-ROOM');
	showEditRoom: boolean = this.globalService.checkForPermission('UPDATE-ROOM');
	showDeleteRoom: boolean =
		this.globalService.checkForPermission('DELETE-ROOM');

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		public accountService: AccountService,
		private activatedRoute: ActivatedRoute,
		private dialogService: DialogService,
		private roomService: RoomService
	) {}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((params) => {
			let roomId = params['id'];
			this.roomService.viewRoom(roomId).then((res) => {
				if (res.status) {
					this.roomForm.disable();
					let data = res.data;
					this.roomForm.patchValue({
						site: data.site.name,
						device: data?.device ? data?.device?.code : '-',
						status: data?.status,
						account: data.site.account.name,
						roomName: data.name,
						wifi: data.wifi.map((wifi) => wifi?.username),
					});

					let occupiedStatus = data?.occupied === 1 ? true : false;
					this.roomForm.get('occupied').patchValue(occupiedStatus);
				}
			});
		});
	}

	getPermissionLabel(permissionName: string): string {
		return permissionName.split('-')[0];
	}

	routeToListRoom() {
		this.router.navigateByUrl(URL_ROUTES.LIST_ROOM);
	}

	deleteRoom() {
		let roomId: any;
		this.activatedRoute.params.subscribe((params) => {
			roomId = params['id'];
		});
		this.dialogService.openDeleteConfirmDialog().then((result) => {
			if (result.value) {
				//call delete site API
				this.roomService.deleteRoom(roomId).then((res: any) => {
					if (res.status) {
						this.router.navigateByUrl(URL_ROUTES.LIST_ROOM);
					}
				});
			}
		});
	}

	routeToEditRoom() {
		let roomId: any;
		this.activatedRoute.params.subscribe((params) => {
			roomId = params['id'];
		});
		this.router.navigateByUrl(URL_ROUTES.EDIT_ROOM + '/' + roomId);
	}
}
