import config from "config";
import app from "./app";
import initDB from "./config/db";
import logger from "./config/logger";

async function Server() {
	const PORT: number = config.get("server.port") || 5502;
	try {
		await initDB();
		logger.info("database connected successfully");
		app.listen(PORT, () => console.log("server listening on port", PORT));
	} catch (err: unknown) {
		if (err instanceof Error) {
			logger.error(`failed to initialize server; ${err.message}`);
			logger.on("finish", () => {
				process.exit(1);
			});
		}
	}
}

Server();
