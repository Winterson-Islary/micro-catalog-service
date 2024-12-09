import { z } from "zod";

export interface ProductService {
	create(product: ProductStorageType): Promise<void>;
}
const UploadedFileSchema = z.object({
	name: z.string(),
	data: z.instanceof(Buffer),
	size: z.number().int(),
	mimetype: z.string(),
	md5: z.string().optional(),
});

const validPriceType = ["base", "additional"] as const;
export const ProductValidatorSchema = z.object({
	name: z.string(),
	description: z.string().max(300),
	priceConfiguration: z.record(
		z.object({
			priceType: z.enum(validPriceType),
			availableOptions: z.record(z.number()),
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

export const ProductStorageSchema = z.object({
	name: z.string(),
	description: z.string().max(300),
	imageId: z.string(),
	priceConfiguration: z.record(
		z.object({
			priceType: z.enum(validPriceType),
			availableOptions: z.record(z.number()),
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

export type ProductStorageType = z.infer<typeof ProductStorageSchema>;
export type ProductTypes = z.infer<typeof ProductValidatorSchema>;
export type UploadedFileType = z.infer<typeof UploadedFileSchema>;
