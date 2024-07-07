import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../core/services/storage.service';
import { StorageType } from '../../constants/storage-type';
import { GlobalService } from '../../core/services/global.service';
import { IUserInfo } from '../../core/interface/userInfo';

@Component({
	selector: 'app-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.scss'],
})

/**
 * Topbar component
 */
export class TopbarComponent implements OnInit {
	element;
	cookieValue;
	flagvalue;
	countryName;
	valueset;
	today = Date.now();

	constructor(
		@Inject(DOCUMENT) private document: any,
		private router: Router,
		private authService: AuthenticationService,
		private authFackservice: AuthfakeauthenticationService,
		public languageService: LanguageService,
		public translate: TranslateService,
		public _cookiesService: CookieService,
		private globalService: GlobalService
	) {
		setInterval(() => {
			this.today = Date.now();
		}, 100);
	}

	listLang = [
		{ text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
		{ text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
		{ text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
		{ text: 'Italian', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
		{ text: 'Russian', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
	];

	openMobileMenu: boolean;

	@Output() settingsButtonClicked = new EventEmitter();
	@Output() mobileMenuButtonClicked = new EventEmitter();

	//
	userInfo: IUserInfo = {
		account: 'NA',
		email: 'NA',
		role: 'NA',
		userName: 'NA',
		name: 'NA',
	};
	badgeType: string = 'success';

	ngOnInit() {
		this.openMobileMenu = false;
		this.element = document.documentElement;

		this.cookieValue = this._cookiesService.get('lang');
		const val = this.listLang.filter((x) => x.lang === this.cookieValue);
		this.countryName = val.map((element) => element.text);
		if (val.length === 0) {
			if (this.flagvalue === undefined) {
				this.valueset = 'assets/images/flags/us.jpg';
			}
		} else {
			this.flagvalue = val.map((element) => element.flag);
		}
		this.getUserInfo();
	}

	setLanguage(text: string, lang: string, flag: string) {
		this.getUserInfo();
		this.countryName = text;
		this.flagvalue = flag;
		this.cookieValue = lang;
		this.languageService.setLanguage(lang);
	}

	/**
	 * Toggles the right sidebar
	 */
	toggleRightSidebar() {
		this.settingsButtonClicked.emit();
	}

	/**
	 * Toggle the menu bar when having mobile screen
	 */
	toggleMobileMenu(event: any) {
		event.preventDefault();
		this.mobileMenuButtonClicked.emit();
	}

	/**
	 * Logout the user
	 */
	logout() {
		this.router.navigate(['/']);
		StorageService.remove(StorageType.ACCESS_TOKEN);
	}

	/**
	 * Fullscreen method
	 */
	fullscreen() {
		document.body.classList.toggle('fullscreen-enable');
		if (
			!document.fullscreenElement &&
			!this.element.mozFullScreenElement &&
			!this.element.webkitFullscreenElement
		) {
			if (this.element.requestFullscreen) {
				this.element.requestFullscreen();
			} else if (this.element.mozRequestFullScreen) {
				/* Firefox */
				this.element.mozRequestFullScreen();
			} else if (this.element.webkitRequestFullscreen) {
				/* Chrome, Safari and Opera */
				this.element.webkitRequestFullscreen();
			} else if (this.element.msRequestFullscreen) {
				/* IE/Edge */
				this.element.msRequestFullscreen();
			}
		} else {
			if (this.document.exitFullscreen) {
				this.document.exitFullscreen();
			} else if (this.document.mozCancelFullScreen) {
				/* Firefox */
				this.document.mozCancelFullScreen();
			} else if (this.document.webkitExitFullscreen) {
				/* Chrome, Safari and Opera */
				this.document.webkitExitFullscreen();
			} else if (this.document.msExitFullscreen) {
				/* IE/Edge */
				this.document.msExitFullscreen();
			}
		}
	}

	getUserInfo() {
		this.userInfo = this.globalService.getUserInfo();
		const role = this.userInfo.role;
		if (role === 'Super-Admin') {
			this.badgeType = 'warning';
		}
	}
}
