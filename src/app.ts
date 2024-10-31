import config from "config";
import express, { type Request, type Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
	res.json({ message: `listening on port: ${config.get("server.port")}` });
});

export default app;
