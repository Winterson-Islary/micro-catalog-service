import type { NextFunction, Request, Response } from "express";
import type { UploadedFile } from "express-fileupload";
import createHttpError from "http-errors";
import { ZodError } from "zod";
import logger from "../config/logger";
import {
	type ProductTypes,
	ProductValidatorSchema,
	UpdateProductSchema,
	type UpdateProductType,
} from "./product-types";

export const ProductValidator = async (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	try {
		const parsedName = req.body.name || undefined;
		const parsedDesc = req.body.description || undefined;
		const parsedImage = req.files?.image || undefined;
		const parsedProductId = req.body.productId || undefined;
		const parsedTenantId = req.body.tenantId || undefined;
		const isPublished = Boolean(req.body.isPublished);
		const parsedPriceConfiguration =
			JSON.parse(req.body.priceConfiguration as string) || undefined;
		const parsedAttributes =
			JSON.parse(req.body.attributes as string) || undefined;
		if (!parsedImage) {
			throw new Error("Please upload a valid image.");
		}
		const tempData: ProductTypes = {
			name: parsedName,
			description: parsedDesc,
			priceConfiguration: parsedPriceConfiguration,
			attributes: parsedAttributes,
			productId: parsedProductId,
			tenantId: parsedTenantId,
			isPublished: isPublished,
		};
		logger.info(
			`PRICE_CONFIGURATION: ${JSON.stringify(parsedPriceConfiguration)}`,
		);
		logger.info(`ATTRIBUTES: ${JSON.stringify(parsedAttributes)}`);
		const productInput = await ProductValidatorSchema.parseAsync(tempData);
		req.body.productInput = productInput;
		return next();
	} catch (error: unknown) {
		if (error instanceof ZodError) {
			logger.info(`Zod Issues: ${JSON.stringify(error.issues)}`);
			return next(createHttpError(400, error.issues));
		}
		if (error instanceof Error) {
			return next(createHttpError(400, error.message));
		}
		return next(createHttpError(400, "failed to parse product input"));
	}
};

export const UpdateProductValidator = async (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	try {
		const { productId: parsedProductId } = req.params || undefined;
		if (!parsedProductId) {
			throw new Error("product id required for update");
		}
		const parsedName = req.body.name || undefined;
		const parsedDesc = req.body.description || undefined;
		const parsedImage = (req.files?.image as UploadedFile) || undefined;
		const parsedTenantId = req.body.tenantId || undefined;
		const isPublished = Boolean(req.body.isPublished) || undefined;
		const parsedPriceConfiguration =
			JSON.parse(req.body.priceConfiguration as string) || undefined;
		const parsedAttributes =
			JSON.parse(req.body.attributes as string) || undefined;
		const tempData: UpdateProductType = {
			name: parsedName,
			description: parsedDesc,
			priceConfiguration: parsedPriceConfiguration,
			attributes: parsedAttributes,
			productId: parsedProductId,
			tenantId: parsedTenantId,
			isPublished,
		};
		const productInput = await UpdateProductSchema.parseAsync(tempData);
		req.body.productInput = { ...productInput, image: parsedImage };
		return next();
	} catch (error: unknown) {
		if (error instanceof ZodError) {
			logger.info(`Zod Issues: ${JSON.stringify(error.issues)}`);
			return next(createHttpError(400, error.issues));
		}
		if (error instanceof Error) {
			return next(createHttpError(400, error.message));
		}
		return next(createHttpError(400, "failed to parse product input"));
	}
};
//! TEST IT
