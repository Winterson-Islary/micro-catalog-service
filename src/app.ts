import config from "config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Request, type Response } from "express";
import fileUpload from "express-fileupload";
import CategoryRouter from "./category/category-router";
import authenticate from "./common/middleware/authenticate";
import globalErrorHandler from "./common/middleware/globalErrorHandler";
import ProductRouter from "./product/product-router";

const app = express();
app.use(cookieParser());
app.use(
	fileUpload({
		limits: { fileSize: 500 * 1024 },
		abortOnLimit: true,
	}),
);
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.json({ message: `listening on port: ${config.get("server.port")}` });
});
app.use("/categories", CategoryRouter);
app.use("/products", ProductRouter);
app.use(globalErrorHandler);

export default app;
