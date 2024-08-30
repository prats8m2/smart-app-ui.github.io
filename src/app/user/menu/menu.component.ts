import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { MenuService } from '../services/menu.service';

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
	menuData: any;

	constructor(private router: Router, private menuService: MenuService) {
		document.body.setAttribute('data-bs-theme', 'dark');
	}

	async ngOnInit() {
		const res = await this.menuService.getAppMenu();
		if (res.status) {
			this.menuData = res.data;
			console.log(this.menuData);
		} else {
			return null;
		}
	}

	routeTo(page: string) {
		switch (page) {
			case 'HOME':
				{
					this.router.navigateByUrl(URL_ROUTES.HOME);
				}
				break;
		}
	}
}
