import config from "config";
import express, { type Request, type Response } from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app = express();

app.get("/", (req: Request, res: Response) => {
	res.json({ message: `listening on port: ${config.get("server.port")}` });
});

app.use(globalErrorHandler);

export default app;
