import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'paymentType',
})
export class PaymentTypePipe implements PipeTransform {
	transform(type: number): string {
		switch (type) {
			case 1:
				return 'Online';
			case 2:
				return 'Offline';
		}
	}
}
