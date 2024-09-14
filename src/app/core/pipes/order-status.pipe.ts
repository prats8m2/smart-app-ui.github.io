import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'orderStatus',
})
export class OrderStatusPipe implements PipeTransform {
	transform(type: number): string {
		switch (type) {
			case 1:
				return 'New';
			case 2:
				return 'In Progress';
			case 3:
				return 'Completed';
			case 4:
				return 'Delivered';
			case 5:
				return 'Cancelled';
		}
	}
}
