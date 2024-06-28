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
		}
	}
}
