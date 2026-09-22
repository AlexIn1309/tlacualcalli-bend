/* Autenticacion de roles */

import { ForbiddenError } from "../errors/forbidden-error";

export const roleMiddleware = (allowedRoles: number[]) => {
	return async (c, next) => {
		const user = c.get("user");

		if(!user){
			throw new ForbiddenError();
		}
		await next();
	};
};
