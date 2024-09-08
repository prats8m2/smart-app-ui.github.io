import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-event-details',
	templateUrl: './event-details.component.html',
	styleUrls: ['./event-details.component.scss'],
})
export class EventDetailsComponent {
	@Input() event: any;

	constructor(public activeModal: NgbActiveModal) {}
}
