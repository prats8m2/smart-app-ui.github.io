import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_ROUTES } from '../../constants/routing';
import { HomeService } from '../services/home.service';
import { GlobalService } from '../../core/services/global.service';

@Component({
	selector: 'app-feedback',
	templateUrl: './feedback.component.html',
	styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
	feedbackForm: FormGroup;
	siteId: any;

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private homeService: HomeService,
		private globalService: GlobalService
	) {
		document.body.setAttribute('data-bs-theme', 'dark');
	}

	ngOnInit() {
		this.initForm();
		this.siteId = this.globalService.getAppTokenInfo('SITE');
	}

	initForm() {
		this.feedbackForm = this.fb.group({
			name: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			mobile: ['', Validators.required],
			review: ['', Validators.required],
			cleanlinessRating: [
				0,
				[Validators.required, Validators.min(1), Validators.max(5)],
			],
			serviceQualityRating: [
				0,
				[Validators.required, Validators.min(1), Validators.max(5)],
			],
			facilitiesRating: [
				0,
				[Validators.required, Validators.min(1), Validators.max(5)],
			],
			foodRating: [
				0,
				[Validators.required, Validators.min(1), Validators.max(5)],
			],
			overallRating: [
				0,
				[Validators.required, Validators.min(1), Validators.max(5)],
			],
		});
	}

	onSubmit() {
		if (this.feedbackForm.valid) {
			console.log(this.feedbackForm.value);
			this.feedbackForm.value.site = this.siteId;
			this.homeService.addFeedback(this.feedbackForm.value).then((res) => {
				console.log(res);
				this.router.navigateByUrl(URL_ROUTES.HOME);
			});
		} else {
			// Mark all fields as touched to trigger validation messages
			Object.keys(this.feedbackForm.controls).forEach((key) => {
				const control = this.feedbackForm.get(key);
				control.markAsTouched();
			});
		}
	}

	routeTo(route: string) {
		this.router.navigateByUrl(URL_ROUTES.HOME);
	}
}
