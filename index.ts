/* Inicio e la aplicacion */

import { Hono } from "hono";
import { Env } from "./src/types/env";
import authRoutes from "./src/routes/auth.routes";
import usersRoutes from "./src/routes/users.routes";

const app = new Hono<Env>();

app.route("/auth", authRoutes);
app.route("/users", usersRoutes);

export default app;
