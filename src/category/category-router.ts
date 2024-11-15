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
import {
	CategoryValidator,
	DeleteCategoryValidator,
	PartialCategoryValidator,
} from "./category-validator";

const router = Router();
const categoryService = new CategoryService(logger);
const categoryController = new CategoryController(categoryService, logger);

router.get("/", asyncWrapper(categoryController.get));
router.get("/:id", asyncWrapper(categoryController.getById));
router.post("/", CategoryValidator, asyncWrapper(categoryController.create));
router.put(
	"/update",
	PartialCategoryValidator,
	asyncWrapper(categoryController.update),
);
router.delete(
	"/delete",
	DeleteCategoryValidator,
	asyncWrapper(categoryController.delete),
);
export default router;
