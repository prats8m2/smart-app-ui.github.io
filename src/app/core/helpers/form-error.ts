import { FormGroup } from '@angular/forms';

export function hasError(
	userForm: FormGroup,
	formControlName: string,
	errorType: string
): boolean {
	return userForm.get(formControlName).hasError(errorType);
}

export function isValid(userForm: FormGroup, formControlName: string): boolean {
	return (
		userForm.get(formControlName).touched &&
		userForm.get(formControlName).invalid
	);
}

export function isTouchedAndValid(
	userForm: FormGroup,
	formControlName: string
): boolean {
	return (
		userForm.get(formControlName).touched && userForm.get(formControlName).valid
	);
}

export function isTouched(
	userForm: FormGroup,
	formControlName: string
): boolean {
	return userForm.get(formControlName).touched;
}
