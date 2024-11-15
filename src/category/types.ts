import type { Types } from "mongoose";
import { z } from "zod";

//! uses = [category-validator]
const ValidPriceType = ["base", "additional"] as const;
const ValidWidgetType = ["switch", "radio"] as const;
export const CategoryValidatorSchema = z.object({
	name: z.string(),
	priceConfiguration: z.record(
		z.object({
			priceType: z.enum(ValidPriceType),
			availableOptions: z.array(z.string()),
		}),
	),
	attributes: z.array(
		z.object({
			name: z.string(),
			widgetType: z.enum(ValidWidgetType),
			defaultValue: z.any(),
			availableOptions: z.array(z.string()),
		}),
	),
});
export const PartialCategoryValidatorSchema = z.object({
	name: z.string().optional(),
	priceConfiguration: z
		.record(
			z.object({
				priceType: z.enum(ValidPriceType),
				availableOptions: z.array(z.string()),
			}),
		)
		.optional(),
	attributes: z
		.array(
			z.object({
				name: z.string(),
				widgetType: z.enum(ValidWidgetType),
				defaultValue: z.any(),
				availableOptions: z.array(z.string()),
			}),
		)
		.optional(),
});
export type CategoryTypes = z.infer<typeof CategoryValidatorSchema>;

//! uses = [category-services]
export interface TCategoryService {
	create(category: CategoryTypes): Promise<Types.ObjectId>;
	update(category: CategoryTypes & { id: Types.ObjectId }): Promise<void>;
}
