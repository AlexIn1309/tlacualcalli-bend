/* Uso del acceso de los usuarios */

import { verifyAccessToken } from "../utils/jwt";

export const authMiddleware = async (c, next) => {
	const authorization = c.req.header("Authorization");

	if(!authorization){
		return c.json({ message: "Unauthorized" }, 401);
	}

	const token = authorization.replace("Bearer ", "");

	try {
		const payload = await verifyAccessToken(token, c.env.JWT_SECRET);
		c.set("user", payload);

		await next();
	}catch{
		return c.json({ message: "Invalid Token" }, 401);
	}
};
