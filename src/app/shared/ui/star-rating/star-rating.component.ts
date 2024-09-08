import {
	Component,
	Input,
	Output,
	EventEmitter,
	forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'app-star-rating',
	template: `
		<div class="star-rating">
			<span
				*ngFor="let star of stars; let i = index"
				(click)="rate(i + 1)"
				(mouseenter)="hover(i + 1)"
				(mouseleave)="hover(0)">
				<i
					class="bx"
					[ngClass]="{
						'bxs-star': star <= (hoverRating || rating),
						'bx-star': star > (hoverRating || rating)
					}"></i>
			</span>
		</div>
	`,
	styles: [
		`
			.star-rating {
				font-size: 24px;
				color: #ffd700;
			}
			.fa {
				cursor: pointer;
			}
		`,
	],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => StarRatingComponent),
			multi: true,
		},
	],
})
export class StarRatingComponent implements ControlValueAccessor {
	@Input() rating: number = 0;
	hoverRating: number = 0;
	stars: number[] = [1, 2, 3, 4, 5];

	onChange: any = () => {};
	onTouched: any = () => {};

	writeValue(rating: number): void {
		this.rating = rating;
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		// Implement if you want to disable the component
	}

	rate(rating: number) {
		this.rating = rating;
		this.onChange(this.rating);
		this.onTouched();
	}

	hover(rating: number) {
		this.hoverRating = rating;
	}
}
