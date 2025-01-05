import { Router } from "express";
import authenticate from "../common/middleware/authenticate";
import { CanAccess } from "../common/middleware/canAccess";
import { CloudinaryStorage } from "../common/services/Cloudinary";
import { Roles } from "../common/types";
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

router.get("/", asyncWrapper(productController.getAllProducts));
router.post(
	"/",
	authenticate,
	CanAccess([Roles.ADMIN, Roles.MANAGER]),
	ProductValidator,
	asyncWrapper(productController.create),
);
router.put(
	"/:productId",
	authenticate,
	CanAccess([Roles.ADMIN, Roles.MANAGER]),
	UpdateProductValidator,
	asyncWrapper(productController.update),
);
export default router;
