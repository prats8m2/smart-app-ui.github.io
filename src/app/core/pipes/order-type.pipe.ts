import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'orderType',
})
export class OrderTypePipe implements PipeTransform {
	transform(type: number): string {
		switch (type) {
			case 1:
				return 'Table';
			case 2:
				return 'Room';
			case 3:
				return 'Online';
			case 4:
				return 'Offline';
			case 5:
				return 'SOS';
			case 6:
				return 'Room Service';
			case 7:
				return 'Room Cleaning';
		}
	}
}
