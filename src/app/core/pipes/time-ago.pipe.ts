import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
	transform(value: string): string {
		if (!value) return '';

		const now = new Date().getTime();
		const orderTime = new Date(value).getTime();
		const difference = now - orderTime;

		const minutes = Math.floor(difference / 1000 / 60);

		if (minutes < 1) return 'just now';
		if (minutes < 60) return `${minutes} min ago`;

		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;

		const days = Math.floor(hours / 24);
		return `${days} day${days > 1 ? 's' : ''} ago`;
	}
}
