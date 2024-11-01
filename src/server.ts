import config from "config";
import app from "./app";
import logger from "./config/logger";

function Server() {
	const PORT: number = config.get("server.port") || 5502;
	try {
		app.listen(PORT, () => console.log("SERVER ACTIVE"));
	} catch (err) {
		logger.error(`failed to initialize server; ${err}`);
	}
}

Server();
