/* CONTROLADOR DE AUTENTICACION */

import type { Context } from "hono";
import type { Env } from "../../types/env";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "../../users/repositories/user.repository";
import { SessionRepository } from "../repositories/session.repository";
import { AppError } from "../../errors/app-error";
import { AppError } from "../../errors/app-error";

const authService = new AuthService(new UserRepository(), new SessionRepository());

export class AuthController {
	static async login(c: Context<Env>){
		console.log("[LOGIN] === Iniciando petición de login ===");
		try{
			console.log("[LOGIN] Parsing JSON body...");
			const body = await c.req.json();
			console.log("[LOGIN] Body recibido:", JSON.stringify(body));

			console.log("[LOGIN] Llamando authService.login...");
			const result = await authService.login(c.env.tlacualcalli_db, c.env.JWT_SECRET, body);
			console.log("[LOGIN] Resultado exitoso:", JSON.stringify(result));

			return c.json(result, 200);
		}catch(error){
			console.log("[LOGIN] === ERROR ===");
			console.log("[LOGIN] Tipo de error:", typeof error);
			console.log("[LOGIN] Error:", error);
			console.log("[LOGIN] Es AppError?", error instanceof AppError);

			if(error instanceof AppError){
				console.log("[LOGIN] AppError - Status:", error.statusCode, "Mensaje:", error.message);
				return c.json({ message: error.message }, error.statusCode);
			}
			const message = error instanceof Error ? error.message : "Unknown Error";
			console.log("[LOGIN] Error genérico - Mensaje:", message);
			return c.json({ message }, 500);
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
