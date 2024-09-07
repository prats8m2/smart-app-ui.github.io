import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { StorageService } from '../../core/services/storage.service';
import { StorageType } from '../../constants/storage-type';
import { GlobalService } from '../../core/services/global.service';
import { HomeService } from '../services/home.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WifiDetailsComponent } from '../../shared/ui/wifi-details/wifi-details.component';
import { OrderModalComponent } from '../../shared/ui/order-modal/order-modal.component';

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
	greetingText: string = '';
	greetingIcon: string = '';

	ORDER_TYPE = {
		TABLE: 1,
		ROOM: 2,
		ONLINE: 3,
		OFFLINE: 4,
		SOS: 5,
		ROOM_SERVICE: 6,
		ROOM_CLEANING: 7,
	};

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
		this.updateGreeting();

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
		const modalRef = this.modalService.open(WifiDetailsComponent, {
			centered: true,
			size: 'lg', // You can adjust the size as needed: 'sm', 'lg', 'xl'
		});
		modalRef.componentInstance.wifiDetails = this.wifiDetails;
	}

	openOrderModal(orderType: number) {
		const modalRef = this.modalService.open(OrderModalComponent, {
			centered: true,
			size: 'lg', // You can adjust the size as needed: 'sm', 'lg', 'xl'
		});
		modalRef.componentInstance.orderType = orderType;

		modalRef.result.then(
			(result) => {
				if (result) {
					this.createOrder(orderType, result);
				}
			},
			(reason) => {
				// Modal dismissed
			}
		);
	}

	updateGreeting() {
		const currentHour = new Date().getHours();

		if (currentHour >= 5 && currentHour < 12) {
			this.greetingText = 'Good Morning';
			this.greetingIcon = 'assets/icons/morning.png';
		} else if (currentHour >= 12 && currentHour < 18) {
			this.greetingText = 'Good Afternoon';
			this.greetingIcon = 'assets/icons/afternoon.png';
		} else {
			this.greetingText = 'Good Evening';
			this.greetingIcon = 'assets/icons/evening.png';
		}
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
