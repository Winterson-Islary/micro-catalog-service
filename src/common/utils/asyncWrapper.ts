import type { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";

export default function asyncWrapper(reqHandler: RequestHandler) {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(reqHandler(req, res, next)).catch((err) => {
			if (err instanceof Error) {
				return next(createHttpError(500, err.message));
			}
			return next(createHttpError(500, "Internal server error"));
		});
	};
}
