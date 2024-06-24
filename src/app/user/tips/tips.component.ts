import { Component, OnInit } from '@angular/core';
import {
	trigger,
	state,
	style,
	transition,
	animate,
} from '@angular/animations';

@Component({
	selector: 'app-tips',
	templateUrl: './tips.component.html',
	styleUrls: ['./tips.component.scss'],
	animations: [
		trigger('fadeInOut', [
			state('visible', style({ opacity: 1 })),
			state('hidden', style({ opacity: 0 })),
			transition('visible => hidden', [animate('1s')]),
			transition('hidden => visible', [animate('1s')]),
		]),
	],
})
export class TipsComponent implements OnInit {
	tips: string[] = [
		'Place an order from restaurant',
		'Contact the reception for assistance',
		'Retrieve WiFi details for connection',
		'Emergency SOS for urgent help',
		'Request additional room amenities',
		'Provide feedback on your experience',
	];

	currentTip: string = '';
	currentIndex: number = 0;
	visibility: string = 'visible';

	ngOnInit() {
		this.currentTip = this.tips[this.currentIndex];
		setInterval(() => {
			this.updateTip();
		}, 3000); // Change tip every 3 seconds
	}

	updateTip() {
		this.visibility = 'hidden';
		setTimeout(() => {
			this.currentIndex = (this.currentIndex + 1) % this.tips.length;
			this.currentTip = this.tips[this.currentIndex];
			this.visibility = 'visible';
		}, 1000); // Duration of the fade-out animation
	}
}
