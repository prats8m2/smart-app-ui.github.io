import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { URL_ROUTES } from 'src/app/constants/routing';
import { DialogService } from 'src/app/core/services/dialog.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { MenuService } from '../service/menu.service';

@Component({
	selector: 'app-view-menu',
	templateUrl: './view-menu.component.html',
	styleUrls: ['./view-menu.component.scss'],
})
export class ViewMenuComponent implements OnInit {
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showListMenu: boolean = this.globalService.checkForPermission('LIST-MENU');
	showDeleteMenu: boolean =
		this.globalService.checkForPermission('DELETE-MENU');
	showEditMenu: boolean = this.globalService.checkForPermission('UPDATE-MENU');
	showListCategory: boolean =
		this.globalService.checkForPermission('LIST-CATEGORY');

	menuData: any;

	scheduleControls: any = {
		startDate: [null],
		endDate: [null],
		sunday_startTime: [null],
		sunday_endTime: [null],
		monday_startTime: [null],
		monday_endTime: [null],
		tuesday_startTime: [null],
		tuesday_endTime: [null],
		wednesday_startTime: [null],
		wednesday_endTime: [null],
		thursday_startTime: [null],
		thursday_endTime: [null],
		friday_startTime: [null],
		friday_endTime: [null],
		saturday_startTime: [null],
		saturday_endTime: [{ hour: 1, minute: 1, second: 1 }],
	};

	public menuForm: FormGroup = this.formBuilder.group({
		account: [null],
		site: [null],
		categoryName: [null],
		categoryDesc: [null],
		categorySeq: [null],
		type: [null],
		scheduleData: this.formBuilder.group(this.scheduleControls),
		menuItems: [null],
		status: [null],
	});

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		private activatedRoute: ActivatedRoute,
		private dialogService: DialogService,
		private config: NgbTimepickerConfig,
		private menuService: MenuService
	) {
		this.config.spinners = false;
	}

	ngOnInit(): void {
		this.getMenu();
		this.menuForm.disable();
		this.menuForm.get('menuItems').enable();
	}

	getMenu() {
		this.activatedRoute.params.subscribe((params) => {
			let menuId = params['id'];
			this.menuService.viewMenu(menuId).then((res) => {
				if (res.status) {
					this.menuData = res.data;
					const type =
						this.menuData.type === 1
							? 'Food'
							: this.menuData.type === 2
							? 'Amenities'
							: undefined;
					this.menuForm.patchValue({
						account: this.menuData.site.account.name,
						site: this.menuData.site.name,
						categoryName: this.menuData.name,
						categoryDesc: this.menuData.description || '-',
						categorySeq: this.menuData.sequence,
						type: type,
						status: this.menuData.status,
						menuItems: this.menuData.menuItems.map(
							(item: any) => (item = { ...item, disabled: true })
						),
					});

					this.patchScheduleData();
				}
			});
		});
	}

	routeToListMenu() {
		this.router.navigateByUrl(URL_ROUTES.LIST_MENU);
	}

	deleteMenu() {
		let menuId: any;
		this.activatedRoute.params.subscribe((params) => {
			menuId = params['id'];
		});
		this.dialogService.openDeleteConfirmDialog().then((result) => {
			if (result.value) {
				//call delete category API
				this.menuService.deleteMenu(menuId).then((res: any) => {
					if (res.status) {
						this.router.navigateByUrl(URL_ROUTES.LIST_MENU);
					}
				});
			}
		});
	}

	routeToEditMenu() {
		let menuId: any;
		this.activatedRoute.params.subscribe((params) => {
			menuId = params['id'];
		});

		this.router.navigateByUrl(URL_ROUTES.EDIT_MENU + '/' + menuId);
	}

	patchScheduleData() {
		const scheduleData = this.menuForm.get('scheduleData');

		if (scheduleData) {
			scheduleData.patchValue({
				startDate: this.menuData.schedule.startDate,
				endDate: this.menuData.schedule.endDate,
			});
			const daysOfWeek = [
				'sunday',
				'monday',
				'tuesday',
				'wednesday',
				'thursday',
				'friday',
				'saturday',
			];
			daysOfWeek.forEach((day) => {
				const startTimeControl = `${day}_startTime`;
				const endTimeControl = `${day}_endTime`;

				scheduleData
					.get(startTimeControl)
					?.patchValue(
						this.convertTimeObjectToString(
							this.menuData.schedule[startTimeControl]
						)
					);

				scheduleData
					.get(endTimeControl)
					?.patchValue(
						this.convertTimeObjectToString(
							this.menuData.schedule[endTimeControl]
						)
					);
			});
		}
	}

	convertTimeObjectToString(timeString: string) {
		let time = timeString.split(':');
		let timeObj = {
			hour: +time[0],
			minute: +time[1],
			second: +time[2],
		};
		return timeObj;
	}
}
