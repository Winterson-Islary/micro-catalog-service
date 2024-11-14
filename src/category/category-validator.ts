import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { z } from "zod";
import logger from "../config/logger";
import { type CategoryTypes, CategoryValidatorSchema } from "./types";

export const CategoryValidator = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const parsedName = req.body.name || undefined;
		const parsedPriceConfiguration =
			req.body.priceConfiguration || undefined;
		const parsedAttributes = req.body.attributes || undefined;
		const tempData: CategoryTypes = {
			name: parsedName,
			priceConfiguration: parsedPriceConfiguration,
			attributes: parsedAttributes,
		};
		const categoryInput =
			await CategoryValidatorSchema.parseAsync(tempData);
		req.body.categoryInput = categoryInput;
		return next();
	} catch (error: unknown) {
		if (error instanceof z.ZodError) {
			next(createHttpError(400, error.issues));
		}
		if (error instanceof Error) {
			next(createHttpError(400, error.message));
		}
		next(createHttpError(400, "failed to parse category input"));
	}
};
