import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-wifi-details',
	templateUrl: './wifi-details.component.html',
	styleUrls: ['./wifi-details.component.scss'],
})
export class WifiDetailsComponent {
	@Input() wifiDetails: any;

	constructor(public activeModal: NgbActiveModal) {}

	copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
	}
}
