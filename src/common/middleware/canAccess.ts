import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import type { RequestAuth } from "../types";

export function CanAccess(authorizedRoles: string[]) {
	return (req: Request, _res: Response, next: NextFunction) => {
		const requestAuth = req as RequestAuth;
		const role = requestAuth.auth.role;

		if (!authorizedRoles.includes(role)) {
			return next(createHttpError(401, "Unauthorized"));
		}
		next();
	};
}
