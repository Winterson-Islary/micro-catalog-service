import { Router } from "express";
import fileUpload from "express-fileupload";
import createHttpError from "http-errors";
import { CloudinaryStorage } from "../common/services/Cloudinary";
import asyncWrapper from "../common/utils/asyncWrapper";
import logger from "../config/logger";
import { ProductController } from "./product-controller";
import { ProductService } from "./product-service";
import { ProductValidator } from "./product-validator";

const router = Router();
const productServices = new ProductService(logger);
const cloudinaryService = new CloudinaryStorage(logger);
const productController = new ProductController(
	logger,
	productServices,
	cloudinaryService,
);

router.post("/", ProductValidator, asyncWrapper(productController.create));

export default router;
