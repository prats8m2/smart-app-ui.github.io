import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-menu-footer',
	templateUrl: './menu-footer.component.html',
	styleUrls: ['./menu-footer.component.scss'],
})
export class MenuFooterComponent {
	@Input() order: any;
	@Input() pricing: any;
}
