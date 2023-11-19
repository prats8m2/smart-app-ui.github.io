import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'isOccupied',
})
export class RoomOccupiedPipe implements PipeTransform {
	transform(type: number): string {
		switch (type) {
			case 0:
				return 'No';
			case 1:
				return 'Yes';
		}
	}
}
