import { Router } from "express";
import { CategoryController } from "./category.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { getCategoryByIdSchema } from "./category.validation";

const router = Router();
const categoryController = new CategoryController();

router.get("/", authMiddleware, (req, res, next) => {
  categoryController.list(req, res, next);
});

router.get("/:id", authMiddleware, validate(getCategoryByIdSchema), (req, res, next) => {
  categoryController.getById(req, res, next);
});

export default router;
