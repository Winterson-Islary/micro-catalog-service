import type { Logger } from "winston";
import type { CategoryTypes, TCategoryService } from "./types";

export class CategoryService implements TCategoryService {
	constructor(private logger: Logger) {}
	async create(category: CategoryTypes) {
		this.logger.info(
			`Category value: name: ${category.name}, location: category-service`,
		);
	}
}
