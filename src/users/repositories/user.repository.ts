/* Manejo de base de datos para app users */

import type { UserEntity } from "../entities/user.entity";
export class UserRepository {
	async findByUsername(db: D1Database, username: string): Promise<UserEntity | null>{
		const result = await db
			.prepare("SELECT * FROM tc_users WHERE username = ?")
			.bind(username)
			.first<UserEntity>();

			return result ?? null;
	}

	async findById(db: D1Database, id: number): Promise<UserEntity>{
		return (
			(await db
				.prepare("SELECT * FROM tc_users WHERE id = ?")
				.bind(id)
				.first<UserEntity>()) ?? null
		);
	}

	async create(db: D1Database, username: string, passwordHash: string, roleId: number): Promise<UserEntity>{
		const result = await db
			.prepare("INSERT INTO tc_users (username, password_hash, email, name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)")
			.bind(username, passwordHash, email, name, lastName, phone)
			.run();

			return Number(result.meta.last_row_id);
	}
}
