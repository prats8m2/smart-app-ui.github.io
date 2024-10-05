import {
	Pipe,
	PipeTransform,
	ChangeDetectorRef,
	NgZone,
	OnDestroy,
} from '@angular/core';

@Pipe({
	name: 'timeAgo',
	pure: false,
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
	private timer: any;

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private ngZone: NgZone
	) {}

	transform(value: string): string {
		if (!value) return '';

		this.removeTimer();
		this.updateTime(value);

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

	private updateTime(value: string): void {
		const timeToUpdate = this.getUpdateInterval(value);
		this.ngZone.runOutsideAngular(() => {
			this.timer = setTimeout(() => {
				this.ngZone.run(() => this.changeDetectorRef.markForCheck());
			}, timeToUpdate);
		});
	}

	private getUpdateInterval(value: string): number {
		const now = new Date().getTime();
		const orderTime = new Date(value).getTime();
		const difference = now - orderTime;

		if (difference < 60000) {
			return 1000;
		} else if (difference < 3600000) {
			return 60000;
		} else {
			return 3600000;
		}
	}

	private removeTimer(): void {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}

	ngOnDestroy(): void {
		this.removeTimer();
	}
}
