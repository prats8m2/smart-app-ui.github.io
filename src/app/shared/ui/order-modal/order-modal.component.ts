import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-order-modal',
	templateUrl: './order-modal.component.html',
	styleUrls: ['./order-modal.component.scss'],
})
export class OrderModalComponent {
	@Input() orderType: number;
	description: string = '';
	modalTitle: string = '';
	ORDER_TYPE = {
		TABLE: 1,
		ROOM: 2,
		ONLINE: 3,
		OFFLINE: 4,
		SOS: 5,
		ROOM_SERVICE: 6,
		ROOM_CLEANING: 7,
	};

	constructor(public activeModal: NgbActiveModal) {}

	ngOnInit() {
		this.setModalTitle();
	}

	setModalTitle() {
		switch (this.orderType) {
			case this.ORDER_TYPE.ROOM_SERVICE:
				this.modalTitle = 'Room Service';
				break;
			case this.ORDER_TYPE.ROOM_CLEANING:
				this.modalTitle = 'Room Cleaning';
				break;
			case this.ORDER_TYPE.SOS:
				this.modalTitle = 'Emergency Help (SOS)';
				break;
			default:
				this.modalTitle = 'Create Order';
		}
	}

	submitOrder() {
		this.activeModal.close(this.description);
	}
}
