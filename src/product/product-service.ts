import type { Logger } from "winston";
import productModel from "./product-model";
import type {
	GetProductRT,
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
			.lean();
		return product?.image;
	}
}
