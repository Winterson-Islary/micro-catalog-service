import type { NextFunction, Request, Response } from "express";
import type { UploadedFile } from "express-fileupload";
import createHttpError from "http-errors";
import { v4 as uuid } from "uuid";
import type { Logger } from "winston";
import { z } from "zod";
import type { FileStorage, TUploadReturn } from "../common/types/buckets";
import type { ProductService, ProductTypes } from "./product-types";

export class ProductController {
	constructor(
		private logger: Logger,
		private productService: ProductService,
		private Storage: FileStorage,
	) {
		this.create = this.create.bind(this);
	}
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const { productInput }: { productInput: ProductTypes } = req.body;
			const fileName = uuid();
			const imageData = req.files?.image as UploadedFile;
			const uploadReturn: TUploadReturn = await this.Storage.upload({
				fileName,
				fileData: imageData.data.buffer,
			});
			await this.productService.create({
				name: productInput.name,
				imageId: fileName,
				description: productInput.description,
				priceConfiguration: productInput.priceConfiguration,
				attributes: productInput.attributes,
				tenantId: productInput.tenantId,
				productId: productInput.productId,
				isPublished: productInput.isPublished,
			});
			res.status(201).json({
				message: "product created successfully",
				imgURL: uploadReturn.url,
			});
		} catch (error) {
			this.logger.error(
				`{error: ${error}}, location: 'product-controller'`,
			);
			throw error;
		}
	}
}
