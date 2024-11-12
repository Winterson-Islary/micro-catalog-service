import { type Request, type Response, Router } from "Express";
import { CategoryController } from "./category-controller";
import { CategoryValidator } from "./category-validator";

const router = Router();

const categoryController = new CategoryController();

router.post("/", CategoryValidator, (req: Request, res: Response) => {
	categoryController.create(req, res);
});

export default router;
