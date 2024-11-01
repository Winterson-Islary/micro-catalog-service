import config from "config";
import cookieParser from "cookie-parser";
import express, { type Request, type Response } from "express";
import authenticate from "./common/middleware/authenticate";
import globalErrorHandler from "./common/middleware/globalErrorHandler";

const app = express();
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
	res.json({ message: `listening on port: ${config.get("server.port")}` });
});

app.get("/protected", authenticate, (req: Request, res: Response) => {
	res.json({ message: "i am authenticated" });
});

app.use(globalErrorHandler);

export default app;
