import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import type { Logger } from "winston";
import type { CategoryTypes, TCategoryService } from "./types";

export class CategoryController {
	constructor(
		private categoryService: TCategoryService,
		private logger: Logger,
	) {}
	async create(req: Request, res: Response, next: NextFunction) {
		if (!req.body.categoryInput) {
			return next(
				createHttpError(
					400,
					"{message: 'could not get valid input', location: 'category-controller'}",
				),
			);
		}
		this.categoryService.create(req.body.categoryInput);
		res.json({});
	}
}
