// error-messages.ts
export const errorMessages = {
	accountName: {
		required: 'Account Name is required.',
		maxlength: 'Maximum length exceeded (15 characters maximum).',
		minlength: 'Account Name must be at least 3 character long.',
		pattern: 'Account Name must be alpha numeric with "_" or "-"',
	},
	firstName: {
		required: 'First Name is required.',
		maxlength: 'Maximum length exceeded (30 characters maximum).',
		minlength: 'First Name must be at least 1 character long.',
		pattern: 'First Name must be alpha numeric only',
	},
	lastName: {
		required: 'Last Name is required.',
		maxlength: 'Maximum length exceeded (30 characters maximum).',
		minlength: 'Last Name must be at least 1 character long.',
		pattern: 'Last Name must be alpha numeric only',
	},
	email: {
		required: 'Email is required.',
		pattern: 'Invalid Email',
	},
	password: {
		required: 'Password is required.',
		maxlength: 'Maximum length exceeded (30 characters maximum).',
		minlength: 'Last Name must be at least 6 character long.',
		pattern: 'Invalid Password',
	},
	mobile: {
		required: 'Mobile is required.',
		maxlength: 'Maximum length exceeded (10 characters maximum).',
		minlength: 'Last Name must be at least 6 character long.',
		pattern: 'Invalid Mobile number format',
	},
	siteName: {
		required: 'Site Name is required.',
		maxlength: 'Maximum length exceeded (30 characters maximum).',
		minlength: 'Site Name must be at least 5 character long.',
		pattern: 'Site Name must be alpha numeric with "_" or "-"',
	},
	wifiUserName: {
		required: 'Wifi name is required.',
		maxlength: 'Maximum length exceeded (30 characters maximum).',
		minlength: 'Site Name must be at least 5 character long.',
	},
	wifiPassword: {
		required: 'Wifi password is required.',
		maxlength: 'Maximum length exceeded (30 characters maximum).',
		minlength: 'Password must be at least 5 character long.',
	},
	siteAddress: {
		required: 'Site Address is required.',
		maxlength: 'Maximum length exceeded (30 characters maximum).',
		minlength: 'Address must be at least 5 character long.',
		pattern: 'Role name must be alpha numeric with "_" or "-"',
	},
	roleName: {
		required: 'Role name is required.',
		maxlength: 'Maximum length exceeded (30 characters maximum).',
		minlength: 'Role name must be at least 5 character long.',
		pattern: 'Role name must be alpha numeric with "_" or "-"',
	},
};
