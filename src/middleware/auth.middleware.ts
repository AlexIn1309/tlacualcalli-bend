/* Uso del acceso de los usuarios */

import type { Context, Next } from "hono";
import { verifyAccessToken } from "../utils/jwt";
import type { Env } from "../types/env";

export const authMiddleware = async (c: Context<Env>, next: Next) => {
	console.log("ENTRANDO A Middleware");
	const authorization = c.req.header("Authorization");

	if(!authorization){
		return c.json({ message: "Unauthorized" }, 401);
	}

	const token = authorization.replace("Bearer ", "");

	try {
		if(!c.env.JWT_SECRET){
			console.error("JWT_SECRET no esta definida en c.env");
			return c.json({ message: "Internal Server Error" }, 500);
		}

		const payload = await verifyAccessToken(token, c.env.JWT_SECRET);
		c.set("user", payload);

		await next();
	}catch{
		return c.json({ message: "Invalid Token" }, 401);
	}
};
