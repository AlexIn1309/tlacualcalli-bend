/* CONTROLADOR DE AUTENTICACION */

import type { Context } from "hono";
import type { Env } from "../types/env";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "../users/repositories/user.repository";
import { SessionRepository } from "../repositories/session.repository";

const authService = new AuthService(new UserRepositoy(), new SessionRepository());

export class AuthController {
	static async login(c: Context<Env>){
		try{
			const body = await c.req.json();
			const result = await authService.login(c.env.tlacualcalli_db, c.env.JWT_SECRET, body);
			return c.json(result, 200);
		}catch(error){
			if(error instanceof AppError){
				return c.json({ message: "Internal Server error" }, 500);
			}
		}
	}

	static async refreshToken(c: Context<Env>){
		try{
			const body = await c.req.json();
			const result = await authService.refreshToken(c.env.tlacualcalli_db, c.env.JWT_SECRET, body.refreshToken);

			return c.json(result, 200);
		}catch(error){
			const message = error instanceof Error ? error.message : "Unknown Error";
			return c.json({ success: false, message }, 401);
		}
	}
}
