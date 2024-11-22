import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { Types } from "mongoose";
import type { Logger } from "winston";
import type { CategoryTypes, TCategoryService } from "./category-types";

export class CategoryController {
	constructor(
		private categoryService: TCategoryService,
		private logger: Logger,
	) {
		this.create = this.create.bind(this); //* In-Order to not lose context of this controller when methods are called from our async-wrapper.
		this.update = this.update.bind(this);
		this.get = this.get.bind(this);
		this.getById = this.getById.bind(this);
		this.delete = this.delete.bind(this);
	}
	async create(req: Request, res: Response, next: NextFunction) {
		if (!req.body.categoryInput) {
			throw new Error(
				"{message: 'could not get valid input', location: 'category-controller'}",
			);
		}
		const serviceResponse: Types.ObjectId =
			await this.categoryService.create(req.body.categoryInput);
		this.logger.info("Created Category: ", { id: serviceResponse._id });
		res.status(201).json({ id: serviceResponse._id });
	}
	async get(req: Request, res: Response, next: NextFunction) {
		res.status(200).json({ message: "Get All" });
	}
	async getById(req: Request, res: Response, next: NextFunction) {
		const id: string | undefined = req.params.id || undefined;
		if (!id || !Types.ObjectId.isValid(id)) {
			throw new Error(
				"{message: 'invalid category id', location: 'category-controller'}",
			);
		}
		res.status(200).json({ id: id });
	}
	async update(req: Request, res: Response, next: NextFunction) {
		const categoryId = req.body.categoryInput.id || undefined;
		if (!categoryId) {
			throw new Error(
				"{message: 'missing category id', location: 'category-controller'}",
			);
		}
		const result = await this.categoryService.update(
			req.body.categoryInput,
		);
		res.status(201).json({ message: "update successful" });
	}
	async delete(req: Request, res: Response, next: NextFunction) {
		const items = req.body.deleteItems || undefined;
		if (!items) {
			throw new Error(
				"{route: '/delete', message: 'missing category/categories id', location: 'category-controller'}",
			);
		}
		res.status(201).json({ message: "delete successful" });
	}
}
