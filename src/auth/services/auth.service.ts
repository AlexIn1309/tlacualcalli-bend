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
		console.log("[SERVICE] === Iniciando login ===");
		console.log("[SERVICE] Username:", loginRequest.username);

		console.log("[SERVICE] Buscando usuario en BD...");
		const user = await this.userRepository.findByUsername(db,loginRequest.username);
		console.log("[SERVICE] Usuario encontrado:", user ? "SÍ" : "NO");
		if(user) console.log("[SERVICE] Usuario:", JSON.stringify(user));

		if(!user){
			console.log("[SERVICE] Usuario no encontrado - lanzando AppError 401");
			throw new AppError("Invalid username or password", 401);
		}

		console.log("[SERVICE] Verificando contraseña...");
		const validPassword = await verifyPassword(loginRequest.password, user.password_hash);
		console.log("[SERVICE] Contraseña válida:", validPassword ? "SÍ" : "NO");

		if(!validPassword){
			console.log("[SERVICE] Contraseña inválida - lanzando Error");
			throw new Error("Invalid Username or Password");
		}

		console.log("[SERVICE] Generando refresh token...");
		const refreshToken = generateUUID();
		console.log("[SERVICE] Refresh token generado:", refreshToken);

		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 1000).toISOString();
		console.log("[SERVICE] Expira en:", expiresAt);

		console.log("[SERVICE] Creando sesión en BD...");
		await this.sessionRepository.createSession(db, user.id, refreshToken, expiresAt);
		console.log("[SERVICE] Sesión creada exitosamente");

		console.log("[SERVICE] Generando access token (JWT)...");
		const accessToken = await generateJwt({ userId: user.id, roleId: 1 }, jwtSecret);
		console.log("[SERVICE] Access token generado:", accessToken.substring(0, 50) + "...");

		console.log("[SERVICE] === Login exitoso ===");
		return { accessToken, refreshToken };
	}

	async refreshToken(db: D1Database, jwtSecret: string, refreshToken: string): Promise<RefreshResponseDto>{
		const session = await this.sessionRepository.findByRefreshToken(db, refreshToken);

		if(!session) throw new Error("Invalid refresh token");

		if(new Date(session.expires_at) < new Date()) throw new Error("Invalid or expired Refresh Token");

		if(session.revoked_at) throw new Error("Session revoked");

		const newRefreshToken = generateUUID();

		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

		await this.sessionRepository.revokeSession(db, refreshToken);

		await this.sessionRepository.createSession(db, session.user_id, newRefreshToken, expiresAt);

		const accessToken = await generateJwt({ userId: session.user_id, roleId: 1 }, jwtSecret);

		return { accessToken, refreshToken: newRefreshToken };
	}
}
