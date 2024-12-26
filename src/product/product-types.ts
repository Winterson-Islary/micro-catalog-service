import type { Document } from "mongoose";
import { z } from "zod";

export interface UpdateProductRT extends Document, ProductStorageType {}
export interface ProductService {
	create(product: ProductStorageType): Promise<void>;
	update(
		product: UpdateProductStorageType,
	): Promise<UpdateProductRT | undefined>;
	getProductImage(productId: string): Promise<string | undefined>;
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
	image: z.string(),
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

export const UpdateProductSchema = z.object({
	name: z.string().optional(),
	description: z.string().max(300).optional(),
	priceConfiguration: z
		.record(
			z.object({
				priceType: z.enum(validPriceType),
				availableOptions: z.record(z.number()),
			}),
		)
		.optional(),
	attributes: z
		.array(
			z.object({
				name: z.string(),
				value: z.any(),
			}),
		)
		.optional(),
	tenantId: z.string().optional(),
	productId: z.string(),
	isPublished: z.boolean().default(false).optional(),
});

export const UpdateProductStorageSchema = z.object({
	name: z.string().optional(),
	description: z.string().max(300).optional(),
	image: z.string().optional(),
	priceConfiguration: z
		.record(
			z.object({
				priceType: z.enum(validPriceType),
				availableOptions: z.record(z.number()),
			}),
		)
		.optional(),
	attributes: z
		.array(
			z.object({
				name: z.string(),
				value: z.any(),
			}),
		)
		.optional(),
	tenantId: z.string().optional(),
	productId: z.string(),
	isPublished: z.boolean().default(false).optional(),
});

export type UpdateProductStorageType = z.infer<
	typeof UpdateProductStorageSchema
>;
export type UpdateProductType = z.infer<typeof UpdateProductSchema>;
export type ProductStorageType = z.infer<typeof ProductStorageSchema>;
export type ProductTypes = z.infer<typeof ProductValidatorSchema>;
export type UploadedFileType = z.infer<typeof UploadedFileSchema>;
