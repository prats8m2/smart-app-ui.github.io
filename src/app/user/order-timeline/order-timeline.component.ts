import { Component } from '@angular/core';

@Component({
	selector: 'app-order-timeline',
	templateUrl: './order-timeline.component.html',
	styleUrls: ['./order-timeline.component.scss'],
})
export class OrderTimelineComponent {
	// Timeline config
	slideConfig = {
		slidesToShow: 4,
		slidesToScroll: 1,
		arrows: false,
		dots: true,
	};
}
