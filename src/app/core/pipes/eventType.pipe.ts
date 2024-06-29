import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'eventType',
})
export class EventTypePipe implements PipeTransform {
	transform(type: number): string {
		switch (type) {
			case 1:
				return 'In House';
			case 2:
				return 'Bash';
		}
	}
}
