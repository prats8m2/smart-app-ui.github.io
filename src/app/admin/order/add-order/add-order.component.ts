import { Component } from '@angular/core';
import { LAYOUT_VERTICAL } from 'src/app/layouts/layouts.model';

@Component({
	selector: 'app-add-order',
	templateUrl: './add-order.component.html',
	styleUrls: ['./add-order.component.scss'],
})
export class AddOrderComponent {
	isCondensed = false;

	constructor() {
		document.body.setAttribute('data-bs-theme', 'dark');
	}

	onSettingsButtonClicked() {
		document.body.classList.toggle('right-bar-enabled');
	}

	/**
	 * On mobile toggle button clicked
	 */
	onToggleMobileMenu() {
		this.isCondensed = !this.isCondensed;
		document.body.classList.toggle('sidebar-enable');
		document.body.classList.toggle('vertical-collpsed');

		if (window.screen.width <= 768) {
			document.body.classList.remove('vertical-collpsed');
		}
	}
}
