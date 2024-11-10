import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

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
		//!Implement Validation
	} catch (error) {}
};
