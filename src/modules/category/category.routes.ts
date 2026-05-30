import { Router } from "express";
import { CategoryController } from "./category.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
  getCategoryByIdSchema,
} from "./category.validation";

const router = Router();
const categoryController = new CategoryController();

// GET all categories: Protected (admin, manager, kasir)
router.get("/", authMiddleware, (req, res, next) => {
  categoryController.list(req, res, next);
});

// GET category by ID: Protected (admin, manager, kasir)
router.get("/:id", authMiddleware, validate(getCategoryByIdSchema), (req, res, next) => {
  categoryController.getById(req, res, next);
});

// POST create category: Protected (admin, manager only)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  validate(createCategorySchema),
  (req, res, next) => {
    categoryController.create(req, res, next);
  }
);

// PUT update category: Protected (admin, manager only)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  validate(updateCategorySchema),
  (req, res, next) => {
    categoryController.update(req, res, next);
  }
);

// DELETE category: Protected (admin, manager only)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  validate(getCategoryByIdSchema),
  (req, res, next) => {
    categoryController.delete(req, res, next);
  }
);

export default router;
