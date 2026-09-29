/* Entidad para el uso se las session de los usuarios */

export interface UserSesssionEntity {
	id: string;
	user_id: number;
	refresh_token_uuid: string;
	expires_at: string;
	created_at: string;
	revoked: number;
}
