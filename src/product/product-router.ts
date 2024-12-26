import { Router } from "express";
import fileUpload from "express-fileupload";
import createHttpError from "http-errors";
import { CloudinaryStorage } from "../common/services/Cloudinary";
import asyncWrapper from "../common/utils/asyncWrapper";
import logger from "../config/logger";
import { ProductController } from "./product-controller";
import { ProductServices } from "./product-service";
import { ProductValidator, UpdateProductValidator } from "./product-validator";

const router = Router();
const productServices = new ProductServices(logger);
const cloudinaryService = new CloudinaryStorage(logger);
const productController = new ProductController(
	logger,
	productServices,
	cloudinaryService,
);

router.post("/", ProductValidator, asyncWrapper(productController.create));
router.put(
	"/:productId",
	UpdateProductValidator,
	asyncWrapper(productController.update),
);
export default router;
