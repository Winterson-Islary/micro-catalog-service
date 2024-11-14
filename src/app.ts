import config from "config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Request, type Response } from "express";
import CategoryRouter from "./category/category-router";
import authenticate from "./common/middleware/authenticate";
import globalErrorHandler from "./common/middleware/globalErrorHandler";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.json({ message: `listening on port: ${config.get("server.port")}` });
});
app.use("/categories", CategoryRouter);

app.use(globalErrorHandler);

export default app;
