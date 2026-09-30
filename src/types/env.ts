/* Hacer uso de las variables de entorno */

import type { JwtPayloadDto } from "../auth/dto/jwt-payloads";

export interface Env {
	Bindings: {
		tlacualcalli_db: D1Database;
		JWT_SECRET: string;
	};

	Variables:{
		user: JwtPayloadDto;
	};
}
