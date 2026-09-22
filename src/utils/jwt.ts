/* GENERACION DE JWT */

import { SignJWT, jwtVerify } from "jose";
import { JwtPayloadDto } from "../auth/dto/jwt-payloads";

export async function generateJwt(payload: JwtPayloadDto, secret: string): Promise<string>{
	const secretKey = new TextEncoder().encode(secret);

	return await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("15m")
		.sign(secretKey);
}

export async function verifyAccessToken(token: string, secret: string): Promise<JwtPayloadDto>{
	const secretKey = new TextEncoder().encode(secret);

	const { payload } = await jwtVerify(token, secretKey);

	return payload as JwtPayloadDto;
}
