/* Uso del acceso de los usuarios */

import type { Context, Next } from "hono";
import { verifyAccessToken } from "../utils/jwt";
import type { Env } from "../types/env";

export const authMiddleware = async (c: Context<Env>, next: Next) => {
	console.log("[AUTH] === Middleware de autenticación ===");
	console.log("[AUTH] Verificando header Authorization...");
	const authorization = c.req.header("Authorization");
	console.log("[AUTH] Authorization header:", authorization ? "PRESENTE" : "AUSENTE");

	if(!authorization){
		console.log("[AUTH] No hay token - retornando 401");
		return c.json({ message: "Unauthorized" }, 401);
	}

	const token = authorization.replace("Bearer ", "");
	console.log("[AUTH] Token extraído:", token.substring(0, 30) + "...");

	try {
		if(!c.env.JWT_SECRET){
			console.error("[AUTH] JWT_SECRET no está definida en c.env");
			return c.json({ message: "Internal Server Error" }, 500);
		}
		console.log("[AUTH] JWT_SECRET presente:", c.env.JWT_SECRET ? "SÍ" : "NO");

		console.log("[AUTH] Verificando token...");
		const payload = await verifyAccessToken(token, c.env.JWT_SECRET);
		console.log("[AUTH] Token verificado exitosamente");
		console.log("[AUTH] Payload:", JSON.stringify(payload));

		c.set("user", payload);
		console.log("[AUTH] Usuario guardado en contexto");

		console.log("[AUTH] Continuando con next()...");
		await next();
		console.log("[AUTH] next() completado");
	}catch(error){
		console.log("[AUTH] === ERROR en middleware ===");
		console.log("[AUTH] Error:", error);
		return c.json({ message: "Invalid Token" }, 401);
	}
};
