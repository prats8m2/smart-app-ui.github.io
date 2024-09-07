import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { StorageService } from '../../core/services/storage.service';
import { StorageType } from '../../constants/storage-type';
import { GlobalService } from '../../core/services/global.service';
import { HomeService } from '../services/home.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WifiDetailsComponent } from '../../shared/ui/wifi-details/wifi-details.component';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	siteId: any;
	roomId: any;
	tableId: any;
	wifiDetails: any;
	receptionNumber: any;
	eventDetails: any;
	settings: any;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private globalService: GlobalService,
		private homeService: HomeService,
		private modalService: NgbModal
	) {
		document.body.setAttribute('data-bs-theme', 'dark');

		// Subscribe to query parameters
		this.activatedRoute.queryParams.subscribe((params) => {
			console.log(params);
			StorageService.set(StorageType.APP_ACCESS_TOKEN, params['token']);
		});
	}

	ngOnInit(): void {
		this.siteId = this.globalService.getAppTokenInfo('SITE');
		this.roomId = this.globalService.getAppTokenInfo('ROOM');
		this.tableId = this.globalService.getAppTokenInfo('TABLE');

		this.homeService.getSiteDetails(this.siteId).then((res) => {
			this.wifiDetails = res?.data?.wifi;
			this.receptionNumber = res?.data?.receptionNumber;
			this.eventDetails = res?.data?.events;
			this.settings = res?.data?.settings;
			console.log(
				this.wifiDetails,
				this.receptionNumber,
				this.eventDetails,
				this.settings
			);
		});
	}

	openWifiDetails() {
		const modalRef = this.modalService.open(WifiDetailsComponent);
		modalRef.componentInstance.wifiDetails = this.wifiDetails;
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
					this.router.navigateByUrl(URL_ROUTES.MENU + '/' + 1);
				}
				break;

			case 'AMENITIES':
				{
					this.router.navigateByUrl(URL_ROUTES.AMENITIES + '/' + 2);
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
