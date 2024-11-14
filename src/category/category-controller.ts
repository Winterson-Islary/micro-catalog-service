import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import type { Types } from "mongoose";
import type { Logger } from "winston";
import type { CategoryTypes, TCategoryService } from "./types";

export class CategoryController {
	constructor(
		private categoryService: TCategoryService,
		private logger: Logger,
	) {
		this.create = this.create.bind(this);
	}
	async create(req: Request, res: Response, next: NextFunction) {
		if (!req.body.categoryInput) {
			return next(
				createHttpError(
					400,
					"{message: 'could not get valid input', location: 'category-controller'}",
				),
			);
		}
		const serviceResponse: Types.ObjectId =
			await this.categoryService.create(req.body.categoryInput);
		this.logger.info("Created Category: ", { id: serviceResponse._id });
		res.status(201).json({ id: serviceResponse._id });
	}
}
