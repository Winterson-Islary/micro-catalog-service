import type { Logger } from "winston";
import productModel from "./product-model";
import type { ProductTypes } from "./product-types";

export class ProductService implements ProductService {
	constructor(private logger: Logger) {}
	async create(product: ProductTypes) {
		await productModel.create(product);
		this.logger.info(
			`message: Product Received; location: product-service; Items: ${product}`,
		);
		return;
	}
}
