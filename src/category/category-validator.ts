import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { Types } from "mongoose";
import { z } from "zod";
import {
	type CategoryTypes,
	CategoryValidatorSchema,
	PartialCategoryValidatorSchema,
} from "./category-types";

export const CategoryValidator = async (
	req: Request,
	_res: Response,
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

export const PartialCategoryValidator = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const parsedCategoryId = req.body.id || undefined;
		if (!parsedCategoryId) {
			throw new Error("missing category id; required for update");
		}
		const parsedName = req.body.name || undefined;
		const parsedPriceConfiguration =
			req.body.priceConfiguration || undefined;
		const parsedAttributes = req.body.attributes || undefined;

		const tempData: Partial<CategoryTypes> = {
			name: parsedName,
			priceConfiguration: parsedPriceConfiguration,
			attributes: parsedAttributes,
		};
		const categoryInput =
			await PartialCategoryValidatorSchema.parseAsync(tempData);
		req.body.categoryInput = { ...categoryInput, id: parsedCategoryId };
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

export const DeleteCategoryValidator = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const items: Types.ObjectId[] | undefined =
			req.body.deleteItems || undefined;
		if (!isArrayOfObjectIds(items)) {
			throw new Error(
				"{message: 'invalid ids passed for deletion', location: 'category-validator' }",
			);
		}
		req.body.deleteItems = items;
		return next();
	} catch (error: unknown) {
		if (error instanceof Error) {
			next(createHttpError(400, error.message));
		}
		next(createHttpError(400, "failed to delete items"));
	}
};

//! HELPER FUNCs
function isObjectId(value: unknown): value is Types.ObjectId {
	const id = value as string;
	return Types.ObjectId.isValid(id);
}
function isArrayOfObjectIds(value: unknown): value is Array<Types.ObjectId> {
	return Array.isArray(value) && value.every(isObjectId);
}
