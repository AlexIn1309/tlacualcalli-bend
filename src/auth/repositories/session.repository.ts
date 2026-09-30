/*  */

import type { UserSessionEntity } from "../entities/session.entity";

export class SessionRepository {
	async findByRefreshToken(db: D1Database, refreshTokenUuid: string): Promise<UserSessionEntity | null> {
		const result = await db
			.prepare("SELECT * FROM tc_refresh_token WHERE token_hash = ?")
			.bind(refreshTokenUuid)
			.first<UserSessionEntity>();

			return result ?? null;
	}

	async createSession(db: D1Database, userId: string, refreshTokenUuid: string, expiresAt: string): Promise<UserSessionEntity>{
		const result = await db
			.prepare("INSERT INTO tc_refresh_token (user_id, token_hash, expires_at) VALUES (?,?,?)")
			.bind(userId,refreshTokenUuid,expiresAt)
			.run();

			return result.meta.last_row_id as number;
	}

	async revokeSession(db: D1Database, refreshToken: string): Promise<void> {
		await db
			.prepare("UPDATE tc_refresh_token SET revoked_at = CURRENT_TIMESTAMP WHERE token_hash = ?")
			.bind(refreshToken)
			.run();
	}
}
