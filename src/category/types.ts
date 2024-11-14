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
	attributes: z.object({
		name: z.string(),
		widgetType: z.enum(ValidWidgetType),
		defaultValue: z.any(),
		availableOptions: z.array(z.string()),
	}),
});
export type CategoryTypes = z.infer<typeof CategoryValidatorSchema>;

//! uses = [category-services]
export interface TCategoryService {
	create(category: CategoryTypes): Promise<void>;
}
