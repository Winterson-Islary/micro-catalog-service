import config from "config";
import type { Request, Response } from "express";
import type { HttpError } from "http-errors";
import { v4 as uuidv4 } from "uuid";
import logger from "../../config/logger";

function globalErrorHandler(err: HttpError, req: Request, res: Response) {
	const errorId = uuidv4();
	const statusCode = err.status || 500;
	const isProduction = config.get("server.env") === "production";
	const message = isProduction
		? "An unexpected error has occurred."
		: err.message;

	logger.error(err.message, {
		id: errorId,
		error: err.stack,
		path: req.path,
		method: req.method,
	});

	res.status(statusCode).json({
		errors: [
			{
				ref: errorId,
				type: err.name,
				msg: message,
				path: req.path,
				location: "server",
				stack: isProduction ? null : err.stack,
			},
		],
	});
}

export default globalErrorHandler;
