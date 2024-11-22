import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { ZodError } from "zod";
import { type ProductTypes, ProductValidatorSchema } from "./product-types";

export const ProductValidator = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const parsedName = req.body.name || undefined;
		const parsedDesc = req.body.description || undefined;
		const parsedProductId = req.body.productId || undefined;
		const parsedTenantId = req.body.tenantId || undefined;
		const isPublished = req.body.isPublished;
		const parsedPriceConfiguration =
			req.body.priceConfiguration || undefined;
		const parsedAttributes = req.body.attributes || undefined;
		const tempData: ProductTypes = {
			name: parsedName,
			description: parsedDesc,
			image: "",
			priceConfiguration: parsedPriceConfiguration,
			attributes: parsedAttributes,
			productId: parsedProductId,
			tenantId: parsedTenantId,
			isPublished: isPublished,
		};
		const productInput = await ProductValidatorSchema.parseAsync(tempData);
		req.body.productInput = productInput;
		return next();
	} catch (error: unknown) {
		if (error instanceof ZodError) {
			next(createHttpError(400, error.issues));
		} else if (error instanceof Error) {
			next(createHttpError(400, error.message));
		}
		next(createHttpError(400, "failed to parse product input"));
	}
};
