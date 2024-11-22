import { z } from "zod";

export interface ProductService {
	create(): Promise<void>;
}
const validPriceType = ["base", "additional"] as const;
export const ProductValidatorSchema = z.object({
	name: z.string(),
	description: z.string().max(300),
	image: z.string(),
	priceConfiguration: z.record(
		z.object({
			priceType: z.enum(validPriceType),
			availableOptions: z.array(z.string()),
		}),
	),
	attributes: z.array(
		z.object({
			name: z.string(),
			value: z.any(),
		}),
	),
	tenantId: z.string(),
	productId: z.string(),
	isPublished: z.boolean().default(false),
});

export type ProductTypes = z.infer<typeof ProductValidatorSchema>;
