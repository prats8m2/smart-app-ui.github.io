import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'isDefaultRole',
})
export class DefaultRolePipe implements PipeTransform {
	transform(type: boolean): string {
		switch (type) {
			case true:
				return 'Default';
			case false:
				return 'Non-default';
		}
	}
}
