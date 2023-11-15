import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import {
	PASSWORD_VALIDATION,
	SITE_NAME_VALIDATION,
	USER_NAME_VALIDATION,
} from 'src/app/constants/validations';
import {
	hasError,
	isTouched,
	isTouchedAndValid,
	isValid,
} from 'src/app/core/helpers/form-error';
import { errorMessages } from 'src/app/core/helpers/form-error-message';

@Component({
	selector: 'app-add-site',
	templateUrl: './add-site.component.html',
	styleUrls: ['./add-site.component.scss'],
})
export class AddSiteComponent {
	constructor(private formBuilder: FormBuilder, private router: Router) {}

	public siteForm: FormGroup = this.formBuilder.group({
		siteName: ['', SITE_NAME_VALIDATION],
		wifiDetails: new FormArray([]),
	});
	ngOnInit() {
		console.log(this.siteForm);
	}
	//form validation function
	isError(formControlName: string, errorType: string): boolean {
		return hasError(this.siteForm, formControlName, errorType);
	}

	showError(formControlName: string): boolean {
		return isValid(this.siteForm, formControlName);
	}

	showSuccess(formControlName: string): boolean {
		return isTouchedAndValid(this.siteForm, formControlName);
	}

	formTouched(formControlName: string): boolean {
		return isTouched(this.siteForm, formControlName);
	}

	errorMessage(formControlName: string, errorType: string): string {
		return errorMessages[formControlName][errorType];
	}

	public addSite() {
		// this.accountService.addUser(this.siteForm).then((res) => {
		// 	if (res.status) {
		// 		this.router.navigate([URL_ROUTES.LIST_SITE]);
		// 	} else {
		// 		console.log('error');
		// 	}
		// });

		console.log(this.siteForm.value);
	}

	field(): FormGroup {
		return this.formBuilder.group({
			username: ['', USER_NAME_VALIDATION],
			password: ['', PASSWORD_VALIDATION],
		});
	}

	routeToListSite() {
		this.router.navigateByUrl(URL_ROUTES.LIST_SITE);
	}

	get formData(): FormArray {
		return this.siteForm.get('wifiDetails') as FormArray;
	}

	removeField(i: number) {
		this.formData.removeAt(i);
	}

	addField() {
		this.formData.push(this.field());
	}
}
