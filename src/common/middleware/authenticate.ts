import config from "config";
import type { Request } from "express";
import { type GetVerificationKey, expressjwt } from "express-jwt";
import jwksClient from "jwks-rsa";
import type { AuthCookie } from "../types";

export default expressjwt({
	secret: jwksClient.expressJwtSecret({
		jwksUri: String(config.get("auth.jwksUri")),
		cache: true,
		rateLimit: true,
	}) as GetVerificationKey,
	algorithms: ["RS256"],
	getToken(req: Request): string {
		const authHeader = req.headers.authorization;
		if (authHeader && authHeader.split(" ")[1] !== "undefined") {
			const token = authHeader.split(" ")[1];
			return token;
		}
		const { ACCESS_TOKEN: accessToken } = req.cookies as AuthCookie;
		return accessToken;
	},
});
