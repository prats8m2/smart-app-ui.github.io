import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import {
	CATEGORY_NAME_VALIDATION,
	CATEGORY_DESC_VALIDATION,
} from 'src/app/constants/validations';
import { GlobalService } from 'src/app/core/services/global.service';
import { CategoryService } from '../service/category.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-view-category',
	templateUrl: './view-category.component.html',
	styleUrls: ['./view-category.component.scss'],
})
export class ViewCategoryComponent implements OnInit {
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showListCategory: boolean =
		this.globalService.checkForPermission('LIST-CATEGORY');
	showDeleteCategory: boolean =
		this.globalService.checkForPermission('DELETE-CATEGORY');
	showEditCategory: boolean =
		this.globalService.checkForPermission('UPDATE-CATEGORY');

	categoryData: any;

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

	public categoryForm: FormGroup = this.formBuilder.group({
		account: [null],
		site: [null],
		categoryName: [null],
		categoryDesc: [null],
		categorySeq: [null],
		type: [null],
		scheduleData: this.formBuilder.group(this.scheduleControls),
	});

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		private categoryService: CategoryService,
		private activatedRoute: ActivatedRoute,
		private dialogService: DialogService,
		private config: NgbTimepickerConfig
	) {
		this.config.spinners = false;
	}

	ngOnInit(): void {
		this.getCategory();
		this.categoryForm.disable();
	}

	getCategory() {
		this.activatedRoute.params.subscribe((params) => {
			let categoryId = params['id'];
			this.categoryService.viewCategory(categoryId).then((res) => {
				if (res.status) {
					this.categoryData = res.data;
					const type =
						this.categoryData.type === 1
							? 'Food'
							: this.categoryData.type === 2
							? 'Amenities'
							: undefined;
					this.categoryForm.patchValue({
						account: this.categoryData.site.account.name,
						site: this.categoryData.site.name,
						categoryName: this.categoryData.name,
						categoryDesc: this.categoryData.description,
						categorySeq: this.categoryData.sequence,
						type: type,
					});
					this.patchScheduleData();
				}
			});
		});
	}

	routeToListCategory() {
		this.router.navigateByUrl(URL_ROUTES.LIST_CATEGORY);
	}

	deleteCategory() {
		let categoryId: any;
		this.activatedRoute.params.subscribe((params) => {
			categoryId = params['id'];
		});
		this.dialogService.openConfirmDialog().then((result) => {
			if (result.value) {
				//call delete category API
				this.categoryService.deleteCategory(categoryId).then((res: any) => {
					if (res.status) {
						this.router.navigateByUrl(URL_ROUTES.LIST_CATEGORY);
					}
				});
			}
		});
	}

	routeToEditCategory() {
		let categoryId: any;
		this.activatedRoute.params.subscribe((params) => {
			categoryId = params['id'];
		});

		this.router.navigateByUrl(URL_ROUTES.EDIT_CATEGORY + '/' + categoryId);
	}

	patchScheduleData() {
		const scheduleData = this.categoryForm.get('scheduleData');
		if (scheduleData) {
			scheduleData.patchValue({
				startDate: this.categoryData.schedule.startDate,
				endDate: this.categoryData.schedule.endDate,
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
							this.categoryData.schedule[startTimeControl]
						)
					);
				scheduleData
					.get(endTimeControl)
					?.patchValue(
						this.convertTimeObjectToString(
							this.categoryData.schedule[endTimeControl]
						)
					);
			});
		}
	}

	convertTimeObjectToString(timeString: string) {
		let time = timeString.split(':');
		let timeObj = {
			hour: time[0],
			minute: time[1],
			second: time[2],
		};
		return timeObj;
	}
}
