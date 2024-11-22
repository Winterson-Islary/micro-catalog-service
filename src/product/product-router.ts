import { Router } from "express";
import asyncWrapper from "../common/utils/asyncWrapper";
import logger from "../config/logger";
import { ProductController } from "./product-controller";
import { ProductService } from "./product-service";
import { ProductValidator } from "./product-validator";

const router = Router();
const productServices = new ProductService(logger);
const productController = new ProductController(logger, productServices);

router.post("/", ProductValidator, asyncWrapper(productController.create));

export default router;
