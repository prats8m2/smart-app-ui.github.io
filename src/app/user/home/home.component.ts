import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { StorageService } from '../../core/services/storage.service';
import { StorageType } from '../../constants/storage-type';
import { GlobalService } from '../../core/services/global.service';
import { HomeService } from '../services/home.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	siteId: any;
	roomId: any;
	tableId: any;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private globalService: GlobalService,
		private homeService: HomeService
	) {
		document.body.setAttribute('data-bs-theme', 'dark');
		this.activatedRoute.params.subscribe((params) => {
			StorageService.set(StorageType.APP_ACCESS_TOKEN, params['token']);
		});
	}

	ngOnInit(): void {
		this.siteId = this.globalService.getAppTokenInfo('SITE');
		this.roomId = this.globalService.getAppTokenInfo('ROOM');
		this.tableId = this.globalService.getAppTokenInfo('TABLE');
	}

	async createOrder(type, description) {
		await this.homeService.createOrder(
			this.siteId,
			this.roomId,
			this.tableId,
			type,
			description
		);
	}

	routeTo(page: string) {
		switch (page) {
			case 'MENU':
				{
					this.router.navigateByUrl(URL_ROUTES.MENU);
				}
				break;
			case 'ORDERS':
				{
					this.router.navigateByUrl(URL_ROUTES.ORDER_HISTORY);
				}
				break;
		}
	}
}
