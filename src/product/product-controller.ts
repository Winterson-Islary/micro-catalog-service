import type { NextFunction, Request, Response } from "express";
import type { UploadedFile } from "express-fileupload";
import createHttpError from "http-errors";
import { Types } from "mongoose";
import { v4 as uuid } from "uuid";
import type { Logger } from "winston";
import { type RequestAuth, Roles } from "../common/types";
import type { FileStorage, TUploadReturn } from "../common/types/buckets";
import type {
	GetProductRT,
	ProductFilter,
	ProductService,
	ProductTypes,
	UpdateProductRT,
} from "./product-types";

export class ProductController {
	constructor(
		private logger: Logger,
		private productService: ProductService,
		private Storage: FileStorage,
	) {
		this.create = this.create.bind(this);
		this.update = this.update.bind(this);
	}
	async create(req: Request, res: Response, _next: NextFunction) {
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
				image: fileName,
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
				`{error: ${error}; location: 'product-controller'}`,
			);
			throw error;
		}
	}

	async getAllProducts(req: Request, res: Response, _next: NextFunction) {
		try {
			const { searchString, tenantId, categoryId, isPublished } =
				req.query;
			const filters: ProductFilter = {};
			if (isPublished === "true") {
				filters.isPublished = true;
			}
			if (tenantId) filters.tenantId = tenantId as string;
			if (categoryId && Types.ObjectId.isValid(categoryId as string)) {
				filters.categoryId = new Types.ObjectId(categoryId as string);
			}

			const result: GetProductRT[] | undefined =
				await this.productService.getAllProducts(
					String(searchString),
					filters,
				);

			this.logger.info(`Listing Products: ${result}`); //! display result array (remove in production)
			res.status(200).json({});
		} catch (error) {
			this.logger.error(
				`{error: ${error}; location: 'product-controller'}`,
			);
			throw error;
		}
	}

	async update(req: Request, res: Response, _next: NextFunction) {
		try {
			const {
				image,
				productId,
				name,
				description,
				priceConfiguration,
				attributes,
				tenantId,
				isPublished,
			} = req.body.productInput;
			const product = await this.productService.getProduct(productId);
			if (!product) {
				throw new Error(
					`product with id: ${productId} could not be found`,
				);
			}
			if ((req as RequestAuth).auth.role !== Roles.ADMIN) {
				const _tenantId = (req as RequestAuth).auth.tenantId;
				if (product.tenantId !== String(_tenantId)) {
					throw createHttpError(
						403,
						"you don't have sufficient permission",
					);
				}
			}

			let newImageName: string | undefined;
			const newImage = image as UploadedFile;
			if (newImage) {
				const oldImage = product.image;
				newImageName = uuid();
				await this.Storage.upload({
					fileName: newImageName,
					fileData: newImage.data.buffer,
				});
				if (oldImage) {
					await this.Storage.delete(oldImage);
				}
			} else {
				newImageName =
					await this.productService.getProductImage(productId);
			}

			if (!productId) {
				throw new Error("missing product id");
			}
			const updatedProduct: UpdateProductRT | undefined =
				await this.productService.update({
					productId,
					image: newImageName,
					name,
					description,
					priceConfiguration,
					attributes,
					tenantId,
					isPublished,
				});

			res.status(201).json({
				id: updatedProduct?._id,
				message: "product updated successfully",
			});
		} catch (error) {
			this.logger.error(
				`{error: ${error}}, location: 'product-controller'`,
			);
			throw error;
		}
	}
}
