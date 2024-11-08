import config from "config";
import mongoose from "mongoose";

export default async function initDB() {
	await mongoose.connect(config.get("database.uri"));
}
