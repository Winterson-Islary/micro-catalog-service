import config from "config";
import app from "./app";

function Server() {
	const PORT: number = config.get("server.port") || 5502;
	try {
		app.listen(PORT, () => console.log("SERVER ACTIVE"));
	} catch (err) {}
}

Server();
