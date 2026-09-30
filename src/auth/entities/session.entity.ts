//
export interface UserSessionEntity {
	id: string;
	user_id: string;
	token_hash: string;
	expires_at: string;
	revoked_at: string | null;
	created_at: string;
}
