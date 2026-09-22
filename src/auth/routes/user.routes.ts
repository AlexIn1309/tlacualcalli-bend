/* RUTAS DE USUARIOS */

import { Hono } from "hono";

import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const users = new Hono();

users.get("/istrator-only", authMiddleware, roleMiddleware([1]), (c) => {
	return c.json({ message: "Bienvenido TEST 1" });
});

export default users;
