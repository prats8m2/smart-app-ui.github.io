import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventDetailsComponent } from '../../shared/ui/event-details/event-details.component';
import { HomeService } from '../services/home.service';
import { GlobalService } from '../../core/services/global.service';
import { Router } from '@angular/router';
import { URL_ROUTES } from '../../constants/routing';

@Component({
	selector: 'app-events',
	templateUrl: './events.component.html',
	styleUrls: ['./events.component.scss'],
})
export class EventsComponent {
	events: any[];
	siteId: any;

	constructor(
		private router: Router,
		private modalService: NgbModal,
		private homeService: HomeService,
		private globalService: GlobalService
	) {
		document.body.setAttribute('data-bs-theme', 'dark');
	}

	ngOnInit() {
		this.siteId = this.globalService.getAppTokenInfo('SITE');
		this.loadEvents();
	}

	async loadEvents() {
		const res = await this.homeService.getSiteDetails(this.siteId);
		this.events = res?.data?.events;
	}

	openEventDetails(event: any) {
		const modalRef = this.modalService.open(EventDetailsComponent, {
			centered: true,
			size: 'lg',
		});
		modalRef.componentInstance.event = event;
	}
	routeTo(page: string) {
		switch (page) {
			case 'HOME':
				this.router.navigateByUrl(URL_ROUTES.HOME);
				break;
			// Add other cases if needed
		}
	}
}
