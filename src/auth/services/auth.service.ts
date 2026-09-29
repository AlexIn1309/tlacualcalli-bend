/* Servicios de Autenticacion */

import { UserRepository } from "../../users/repositories/user.repository";
import { generateJwt } from "../../utils/jwt";
import { SessionRepository } from "../repositories/session.repository";
import { verifyPassword } from "../../utils/password";
import { generateUUID } from "../../utils/uuid";
import { AppError } from "../../errors/app-error";

import type { LoginRequestDto } from "../dto/login-request.dto";
import type { LoginResponseDto } from "../dto/login-response.dto";

export class AuthService {
	constructor(private readonly userRepository: UserRepository, private readonly sessionRepository: SessionRepository){}
	async login(db: D1Database, jwtSecret: string, loginRequest: LoginRequestDto): Promise<LoginResponseDto>{
		const user = await this.userRepository.findByUsername(db,loginRequest.username);
		if(!user)throw new AppError("Invalid username or password", 401);

		const validPassword = await verifyPassword(loginRequest.password, user.passwor_hash);

		if(!validPassword) throw new Error("Invalid Username or Password");

		const refreshToken = generateUUID();

		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 1000).toISOString();

		await this.sessionRepository.createSession(db, user.id, refreshToken, expiresAt);

		const accessToken = await generateJwt({ userId: user.id, roleId: user.role_id }, jwtSecret);

		return { accessToken, refreshToken };
	}

	async refreshToken(db: D1Database, jwtSecret: string, refreshToken: string): Promise<RefreshResponseDto>{
		const session = await this.sessionRepository.findByRefreshToken(db, refreshToken);

		if(!session) throw new Error("Invalid refresh token");

		if(new Date(session.expires_at) < new Date()) throw new Error("Invalid or expired Refresh Token");

		if(session.revoked) throw new Error("User not found");

		const newRefreshToken = generateUUID();

		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

		await this.sessionRepository.revokeSession(db, refreshToken);

		await this.sessionRepository.createSession(db, session.user_id, newRefreshToken, expiresAt);

		const accessToken = await generateJwt({ userId: user.id, roleId: user.role_id }, jwtSecret);

		return { accessToken, refreshToken: newRefreshToken };
	}
}
