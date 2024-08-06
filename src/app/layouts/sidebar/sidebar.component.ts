import {
	AfterViewInit,
	Component,
	ElementRef,
	Input,
	OnChanges,
	OnInit,
	ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import MetisMenu from 'metismenujs';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from '../../core/services/global.service';
import { MENU } from './menu';
import { MenuItem } from './menu.model';
import { DialogService } from 'src/app/core/services/dialog.service';
import { take } from 'rxjs';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
})

/**
 * Sidebar component
 */
export class SidebarComponent implements OnInit, AfterViewInit, OnChanges {
	@ViewChild('componentRef') scrollRef;
	@Input() isCondensed = false;
	menu: any;
	data: any;
	permissions: any;
	selectedMenuItem: MenuItem;

	menuItems = [];

	@ViewChild('sideMenu') sideMenu: ElementRef;

	constructor(
		private router: Router,
		public translate: TranslateService,
		private globalService: GlobalService,
		private dialogService: DialogService
	) {
		router.events.forEach((event) => {
			if (event instanceof NavigationEnd) {
				this._activateMenuDropdown();
				this._scrollElement();
			}
		});
	}

	ngOnInit() {
		this.initialize();
		this._scrollElement();
	}

	ngAfterViewInit() {
		this.menu = new MetisMenu(this.sideMenu.nativeElement);
		this._activateMenuDropdown();
	}

	toggleMenu(event) {
		event.currentTarget.nextElementSibling.classList.toggle('mm-show');
	}

	ngOnChanges() {
		if ((!this.isCondensed && this.sideMenu) || this.isCondensed) {
			setTimeout(() => {
				this.menu = new MetisMenu(this.sideMenu.nativeElement);
			});
		} else if (this.menu) {
			this.menu.dispose();
		}
	}
	_scrollElement() {
		setTimeout(() => {
			if (document.getElementsByClassName('mm-active').length > 0) {
				const currentPosition =
					document.getElementsByClassName('mm-active')[0]['offsetTop'];
				if (currentPosition > 500)
					if (this.scrollRef.SimpleBar !== null)
						this.scrollRef.SimpleBar.getScrollElement().scrollTop =
							currentPosition + 300;
			}
		}, 300);
	}
	_removeAllClass(className) {
		const els = document.getElementsByClassName(className);
		while (els[0]) {
			els[0].classList.remove(className);
		}
	}

	_activateMenuDropdown() {
		this._removeAllClass('mm-active');
		this._removeAllClass('mm-show');
		const links = document.getElementsByClassName('side-nav-link-ref');
		let menuItemEl = null;
		// tslint:disable-next-line: prefer-for-of
		const paths = [];
		for (let i = 0; i < links.length; i++) {
			paths.push(links[i]['pathname']);
		}
		var itemIndex = paths.indexOf(window.location.pathname);
		if (itemIndex === -1) {
			const strIndex = window.location.pathname.lastIndexOf('/');
			const item = window.location.pathname.substr(0, strIndex).toString();
			menuItemEl = links[paths.indexOf(item)];
		} else {
			menuItemEl = links[itemIndex];
		}
		if (menuItemEl) {
			menuItemEl.classList.add('active');
			const parentEl = menuItemEl.parentElement;
			if (parentEl) {
				parentEl.classList.add('mm-active');
				const parent2El = parentEl.parentElement.closest('ul');
				if (parent2El && parent2El.id !== 'side-menu') {
					parent2El.classList.add('mm-show');
					const parent3El = parent2El.parentElement;
					if (parent3El && parent3El.id !== 'side-menu') {
						parent3El.classList.add('mm-active');
						const childAnchor = parent3El.querySelector('.has-arrow');
						const childDropdown = parent3El.querySelector('.has-dropdown');
						if (childAnchor) {
							childAnchor.classList.add('mm-active');
						}
						if (childDropdown) {
							childDropdown.classList.add('mm-active');
						}
						const parent4El = parent3El.parentElement;
						if (parent4El && parent4El.id !== 'side-menu') {
							parent4El.classList.add('mm-show');
							const parent5El = parent4El.parentElement;
							if (parent5El && parent5El.id !== 'side-menu') {
								parent5El.classList.add('mm-active');
								const childanchor = parent5El.querySelector('.is-parent');
								if (childanchor && parent5El.id !== 'side-menu') {
									childanchor.classList.add('mm-active');
								}
							}
						}
					}
				}
			}
		}
	}

	initialize(): void {
		this.permissions = this.globalService.getUserRole('permissions');

		let permissionArray: any[] = [];
		this.permissions.forEach((item: any) => {
			permissionArray.push(item.name);
		});

		for (const item of MENU) {
			if (permissionArray.includes(item.permission)) {
				this.menuItems.push(item);
			}
		}
	}

	hasItems(item: MenuItem) {
		return item.subItems !== undefined ? item.subItems.length > 0 : false;
	}

	navigateToModule(routerLink: string) {
		this.globalService.allowSideNavRoute.pipe(take(1)).subscribe((res) => {
			if (res) {
				this.router.navigateByUrl(routerLink);
			}
			if (!res) {
				this.dialogService.openBackConfirmDialog().then((result) => {
					if (result.value) {
						this.router.navigateByUrl(routerLink);
						this.globalService.allowSideNavRoute.next(true);
					}
				});
			}
		});
	}
}
