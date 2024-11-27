import type { NextFunction, Request, Response } from "express";
import type { Logger } from "winston";
import type { ProductService, ProductTypes } from "./product-types";

export class ProductController {
	constructor(
		private logger: Logger,
		private productService: ProductService,
	) {
		this.create = this.create.bind(this);
	}
	async create(req: Request, res: Response, next: NextFunction) {
		const { productInput } = req.body;
		await this.productService.create(productInput as ProductTypes);
		res.status(201).json({ message: "product created successfully" });
	}
}
