import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'siteTypePipe',
})
export class SiteTypePipe implements PipeTransform {
	transform(type: number): string {
		switch (type) {
			case 1:
				return 'Restaurant';
			case 2:
				return 'Hotel';
		}
	}
}
