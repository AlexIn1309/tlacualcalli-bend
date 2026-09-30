export interface UserEntity {
	id: string;
	email: string;
	username: string;
	password_hash: string;
	name: string;
	last_name: string;
	phone: string | null;
	is_active: number;
	created_at: string;
}
