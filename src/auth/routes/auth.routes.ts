/* RUTAS DE AUTENTICACION */

import { Hono } from "hono";

import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const auth = new Hono();

auth.post("/login", AuthController.login);

auth.post("/refresh-token", AuthController.refreshToken);

auth.get("/me", authMiddleware, (c) => {
console.log("PIDIENDO ME");
	const user = c.get("user");
	
	return c.json({
		authenticated: true,
		user,
	});
});

console.log("INICIANDO auth rutas");
export default auth;
