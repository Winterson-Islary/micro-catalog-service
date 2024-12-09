import type { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import { z } from "zod";

export default function asyncWrapper(reqHandler: RequestHandler) {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(reqHandler(req, res, next)).catch((err) => {
			if (err instanceof z.ZodError) {
				return next(createHttpError(500, err.issues));
			}
			if (err instanceof Error) {
				return next(createHttpError(500, err.message));
			}
			return next(createHttpError(500, "Internal server error"));
		});
	};
}
