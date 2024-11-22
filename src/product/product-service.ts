import type { Logger } from "winston";

export class ProductService implements ProductService {
	constructor(private logger: Logger) {}
	async create() {}
}
