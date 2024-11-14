import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from "Express";
import asyncWrapper from "../common/utils/asyncWrapper";
import logger from "../config/logger";
import { CategoryController } from "./category-controller";
import { CategoryService } from "./category-service";
import { CategoryValidator } from "./category-validator";

const router = Router();
const categoryService = new CategoryService(logger);
const categoryController = new CategoryController(categoryService, logger);

router.post("/", CategoryValidator, asyncWrapper(categoryController.create));

export default router;
