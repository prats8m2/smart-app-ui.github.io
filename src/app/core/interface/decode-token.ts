interface Permission {
	id: number;
	name: string;
	createdOn: string;
}

interface Role {
	id: number;
	name: string;
	type: number;
	default: boolean;
	createdOn: string;
	permissions: Permission[];
}

interface Account {
	id: number;
	name: string;
	createdOn: string;
}

export interface DecodedTokenI {
	id: number;
	name: string;
	email: string;
	role: Role;
	exp: number;
	account: Account;
	username: string;
	iat: number;
}

export interface DecodedAppTokenI {
	sessionId: string;
	roomId: number;
	tableId: number;
	siteId: number;
}
