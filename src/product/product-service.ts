import type { AggregatePaginateResult } from "mongoose";
import type { Logger } from "winston";
import productModel from "./product-model";
import type {
	GetProductRT,
	PaginateQuery,
	ProductFilter,
	ProductService,
	ProductStorageType,
	UpdateProductRT,
	UpdateProductStorageType,
} from "./product-types";

export class ProductServices implements ProductService {
	constructor(private logger: Logger) {}
	async create(product: ProductStorageType) {
		await productModel.create(product);
		this.logger.info(
			`message: Product Received; location: product-service; Items: ${product}`,
		);
		return;
	}
	async update(
		product: UpdateProductStorageType,
	): Promise<UpdateProductRT | undefined> {
		const returnValue: UpdateProductRT | null =
			await productModel.findOneAndUpdate(
				{ _id: product.productId },
				{ $set: product },
				{ new: true },
			);
		return returnValue ? returnValue : undefined;
	}

	async getProduct(productId: string): Promise<GetProductRT | undefined> {
		const product: GetProductRT | null = await productModel.findOne({
			_id: productId,
		});
		return product ? product : undefined;
	}

	async getProductImage(productId: string): Promise<string | undefined> {
		const product = await productModel
			.findById(productId)
			.select("image")
			.lean<{ image: string }>();
		return product?.image;
	}

	async getAllProducts(
		searchString: string,
		filters: ProductFilter,
		paginateQuery: PaginateQuery,
	): Promise<AggregatePaginateResult<GetProductRT> | undefined> {
		const searchStringRegex = new RegExp(searchString, "i");

		const matchQuery = {
			...filters,
			name: searchStringRegex,
		};

		const aggregate = productModel.aggregate([
			{
				$match: matchQuery,
			},
			//!/* Fix connection with category by including categoryId to the schema, then uncomment */
			// {
			// 	$lookup: {
			// 		from: "categories",
			// 		localField: "categoryId",
			// 		foreignField: "_id",
			// 		as: "category",
			// 		pipeline: [
			// 			{
			// 				$project: {
			// 					_id: 1,
			// 					name: 1,
			// 					attributes: 1,
			// 					priceConfiguration: 1,
			// 				},
			// 			},
			// 		],
			// 	},
			// },
			// {
			// 	$unwind: "$category",
			// },
		]);

		// const result: GetProductRT[] = await aggregate.exec(); //! Remove in production. (solely for debugging)
		// return await aggregate.exec();
		return productModel.aggregatePaginate(aggregate, { ...paginateQuery });
	}
}
