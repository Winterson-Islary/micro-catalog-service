import mongoose from "mongoose";

type PriceConfiguration = {
	[key: string]: {
		priceType: "base" | "additional";
		availableOptions: string[];
	};
};
type Attribute = {
	name: string;
	widgetType: "switch" | "radio";
	defaultValue: string;
	availableOptions: string[];
};

type Category = {
	name: string;
	priceConfiguration: PriceConfiguration;
	attributes: Attribute[];
};

const priceConfigurationSchema = new mongoose.Schema<PriceConfiguration>({
	priceType: {
		type: String,
		enum: ["base", "additional"],
		required: true,
	},
	availableOptions: {
		type: [String],
		required: true,
	},
});
const attributesSchema = new mongoose.Schema<Attribute>({
	name: {
		type: String,
		required: true,
	},
	widgetType: {
		type: String,
		enum: ["switch", "radio"],
		required: true,
	},
	defaultValue: {
		type: mongoose.Schema.Types.Mixed,
		required: true,
	},
	availableOptions: {
		type: [String],
		required: true,
	},
});

const categorySchema = new mongoose.Schema<Category>({
	name: {
		type: String,
		required: true,
	},
	priceConfiguration: {
		type: Map,
		of: priceConfigurationSchema,
		required: true,
	},
	attributes: {
		type: [attributesSchema],
		required: true,
	},
});

export default mongoose.model("Category", categorySchema);
