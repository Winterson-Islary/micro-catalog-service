import type { NextFunction, Request, Response } from "express";
import createHttpError, { type HttpError } from "http-errors";
import { z } from "zod";
import logger from "../config/logger";

const ValidPriceType = ["base", "additional"] as const;
const ValidWidgetType = ["switch", "radio"] as const;
const CategoryValidatorSchema = z.object({
	name: z.string(),
	priceConfiguration: z.record(
		z.object({
			priceType: z.enum(ValidPriceType),
			availableOptions: z.array(z.string()),
		}),
	),
	attributes: z.object({
		name: z.string(),
		widgetType: z.enum(ValidWidgetType),
		defaultValue: z.any(),
		availableOptions: z.array(z.string()),
	}),
});

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
		const tempData: z.infer<typeof CategoryValidatorSchema> = {
			name: parsedName,
			priceConfiguration: parsedPriceConfiguration,
			attributes: parsedAttributes,
		};
		const validatedInput =
			await CategoryValidatorSchema.parseAsync(tempData);
		req.body.name = validatedInput.name;
		req.body.priceConfiguration = validatedInput.priceConfiguration;
		req.body.attributes = validatedInput.attributes;
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
