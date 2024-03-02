import { HttpClient } from '@angular/common/http';
import {
	AfterViewInit,
	Component,
	ElementRef,
	Input,
	OnChanges,
	OnInit,
	ViewChild,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import MetisMenu from 'metismenujs';
import { EventService } from 'src/app/core/services/event.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { MENU } from 'src/app/layouts/sidebar/menu';
import { MenuItem } from 'src/app/layouts/sidebar/menu.model';

@Component({
	selector: 'app-order-sidebar',
	templateUrl: './order-sidebar.component.html',
	styleUrls: ['./order-sidebar.component.scss'],
})
export class OrderSidebarComponent implements OnInit, AfterViewInit, OnChanges {
	@ViewChild('componentRef') scrollRef;
	@Input() isCondensed = false;
	menu: any;
	data: any;
	permissions: any;
	selectedMenuItem: MenuItem;

	menuItems = [];

	@ViewChild('sideMenu') sideMenu: ElementRef;

	constructor(private router: Router, private globalService: GlobalService) {
		router.events.forEach((event) => {
			if (event instanceof NavigationEnd) {
				this._activateMenuDropdown();
				this._scrollElement();
			}
		});
	}

	ngOnInit() {
		console.log('HI');
		this.initialize();
		this._scrollElement();
	}

	ngAfterViewInit() {
		console.log(this.sideMenu);
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

	/**
	 * remove active and mm-active class
	 */
	_removeAllClass(className) {
		const els = document.getElementsByClassName(className);
		while (els[0]) {
			els[0].classList.remove(className);
		}
	}

	/**
	 * Activate the parent dropdown
	 */
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

	/**
	 * Initialize
	 */
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

	/**
	 * Returns true or false if given menu item has child or not
	 * @param item menuItem
	 */
	hasItems(item: MenuItem) {
		return item.subItems !== undefined ? item.subItems.length > 0 : false;
	}
}
