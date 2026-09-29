/* Entidad para el uso del usuario */

export interface UserEntity {
	id: number;
	username: string;
	password_hash: string;
	role_id: number;
	created_at: string;
}
