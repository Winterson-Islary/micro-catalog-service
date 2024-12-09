import type { Logger } from "winston";
import productModel from "./product-model";
import type { ProductStorageType } from "./product-types";

export class ProductService implements ProductService {
	constructor(private logger: Logger) {}
	async create(product: ProductStorageType) {
		await productModel.create(product);
		this.logger.info(
			`message: Product Received; location: product-service; Items: ${product}`,
		);
		return;
	}
}
