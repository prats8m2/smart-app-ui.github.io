import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'siteTypePipe',
})
export class SiteTypePipe implements PipeTransform {
	transform(type: number): string {
		switch (type) {
			case 1:
				return 'Hotel';
			case 2:
				return 'Restaurant';
		}
	}
}
