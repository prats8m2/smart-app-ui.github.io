import { Component } from '@angular/core';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
	// bread crumb items
	breadCrumbItems: Array<{}>;

	// Collapse declare
	isCollapsed: boolean = false;
	public firstColleaps: boolean = false;
	public secondColleaps: boolean = false;
	public bothColleaps: boolean = false;
	isFirstOpen: boolean = false;


	constructor() {
		document.body.setAttribute('data-bs-theme', 'dark');
	}
}
