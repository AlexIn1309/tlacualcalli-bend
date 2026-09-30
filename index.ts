/* Inicio e la aplicacion */

import { Hono } from "hono";
import { Env } from "./src/types/env";
import authRoutes from "./src/auth/routes/auth.routes";
import usersRoutes from "./src/users/routes/users.routes";

const app = new Hono<Env>();

app.route("/auth", authRoutes);
app.route("/users", usersRoutes);

console.log("INICIANDO TU APP");

export default app;
