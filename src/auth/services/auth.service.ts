/* Servicios de Autenticacion */

import { UserRepository } from "../../users/repositories/user.repository";
import { generateJwt } from "../../utils/jwt";
import { SessionRepository } from "../repositories/session.repository";
import { verifyPassword } from "../../utils/password";
import { generateUUID } from "../../utils/uuid";
import { AppError } "../../errors/app-error";

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
}
