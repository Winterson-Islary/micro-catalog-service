import { type Request, type Response, Router } from "Express";
import { CategoryController } from "./category-controller";

const router = Router();

const categoryController = new CategoryController();

router.post("/", (req: Request, res: Response) => {
	categoryController.create(req, res);
});

export default router;
