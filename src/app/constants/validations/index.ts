import { Validators } from '@angular/forms';

export const FIRST_NAME_VALIDATION = [
	Validators.required,
	Validators.pattern('[a-zA-Z0-9]+'),
	Validators.maxLength(30),
	Validators.minLength(1),
];

export const LAST_NAME_VALIDATION = [
	Validators.required,
	Validators.pattern('[a-zA-Z0-9]+'),
	Validators.maxLength(30),
	Validators.minLength(1),
];

export const USER_NAME_VALIDATION = [
	Validators.required,
	Validators.maxLength(30),
	Validators.pattern('[a-zA-Z0-9_-]+$'),
];

export const EMAIL_VALIDATION = [
	Validators.required,
	Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
];

export const ACCOUNT_NAME_VALIDATION = [
	Validators.required,
	Validators.pattern('[a-zA-Z0-9_-]+$'),
	Validators.maxLength(15),
	Validators.minLength(3),
];

export const PASSWORD_VALIDATION = [
	Validators.required,
	Validators.minLength(6),
];

export const PHONE_VALIDATION = [
	Validators.maxLength(10),
	Validators.pattern(`^(\\+\\d{1,3}[- ]?)?\\d{10}$`),
];

export const SITE_NAME_VALIDATION = [
	Validators.required,
	Validators.maxLength(30),
	Validators.pattern('[a-zA-Z0-9_-]+$'),
	Validators.minLength(5),
];

export const SITE_ADDRESS_VALIDATION = [
	Validators.required,
	Validators.maxLength(30),
	Validators.pattern('[a-zA-Z0-9_-]+$'),
	Validators.minLength(5),
];

export const SITE_ACCOUNT_VALIDATION = [Validators.required];

export const ROLE_NAME_VALIDATION = [
	Validators.required,
	Validators.maxLength(30),
	Validators.pattern('[a-zA-Z0-9_-]+$'),
	Validators.minLength(5),
];

export const DEVICE_NAME_VALIDATION = [
	Validators.required,
	Validators.maxLength(30),
	Validators.pattern('[a-zA-Z0-9_-]+$'),
	Validators.minLength(5),
];

export const ROOM_NAME_VALIDATION = [
	Validators.required,
	Validators.pattern('[a-zA-Z0-9_-]+$'),
	Validators.maxLength(10),
	Validators.minLength(3),
];

export const TABLE_NAME_VALIDATION = [
	Validators.required,
	Validators.pattern('[a-zA-Z0-9_-]+$'),
	Validators.maxLength(10),
	Validators.minLength(5),
];

export const CATEGORY_NAME_VALIDATION = [
	Validators.required,
	Validators.maxLength(15),
	Validators.pattern('[a-zA-Z0-9_-]+$'),
	Validators.minLength(5),
];

export const CATEGORY_DESC_VALIDATION = [
	Validators.maxLength(100),
	Validators.pattern('[a-zA-Z0-9_-]+$'),
	Validators.minLength(10),
];

export const PRODUCT_NAME_VALIDATION = [
	Validators.required,
	Validators.maxLength(15),
	Validators.pattern('[a-zA-Z0-9_-]+$'),
	Validators.minLength(5),
];

export const PRODUCT_DESC_VALIDATION = [
	Validators.maxLength(100),
	Validators.pattern('[a-zA-Z0-9_-]+$'),
	Validators.minLength(10),
];

export const MENU_NAME_VALIDATION = [
	Validators.required,
	Validators.maxLength(15),
	Validators.pattern('[a-zA-Z0-9_-]+$'),
	Validators.minLength(5),
];

export const MENU_DESC_VALIDATION = [
	Validators.maxLength(100),
	Validators.pattern('[a-zA-Z0-9_-]+$'),
	Validators.minLength(10),
];
