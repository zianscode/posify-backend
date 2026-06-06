import { Router } from "express";
import { ProductController } from "./product.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { uploadProductImage } from "../../config/upload";
import { convertFormData } from "../../middlewares/convertFormData.middleware";
import {
  createProductSchema,
  updateProductSchema,
  getProductByIdSchema,
  getProductsQuerySchema,
} from "./product.validation";

const router = Router();
const productController = new ProductController();

// GET all products: Protected (admin, manager, kasir)
router.get("/", authMiddleware, validate(getProductsQuerySchema), (req, res, next) => {
  productController.list(req, res, next);
});

// GET product by ID: Protected (admin, manager, kasir)
router.get("/:id", authMiddleware, validate(getProductByIdSchema), (req, res, next) => {
  productController.getById(req, res, next);
});

// POST create product: Protected (admin, manager only)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  uploadProductImage,
  convertFormData,
  validate(createProductSchema),
  (req, res, next) => {
    productController.create(req, res, next);
  }
);

// PUT update product: Protected (admin, manager only)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  uploadProductImage,
  convertFormData,
  validate(updateProductSchema),
  (req, res, next) => {
    productController.update(req, res, next);
  }
);

// DELETE product: Protected (admin, manager only)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  validate(getProductByIdSchema),
  (req, res, next) => {
    productController.delete(req, res, next);
  }
);

export default router;
