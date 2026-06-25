"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const upload_1 = require("../../config/upload");
const convertFormData_middleware_1 = require("../../middlewares/convertFormData.middleware");
const product_validation_1 = require("./product.validation");
const router = (0, express_1.Router)();
const productController = new product_controller_1.ProductController();
// GET all products: Protected (admin, manager, kasir)
router.get("/", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(product_validation_1.getProductsQuerySchema), (req, res, next) => {
    productController.list(req, res, next);
});
// GET product by ID: Protected (admin, manager, kasir)
router.get("/:id", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(product_validation_1.getProductByIdSchema), (req, res, next) => {
    productController.getById(req, res, next);
});
// POST create product: Protected (admin, manager only)
router.post("/", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["admin", "manager"]), upload_1.uploadProductImage, convertFormData_middleware_1.convertFormData, (0, validate_middleware_1.validate)(product_validation_1.createProductSchema), (req, res, next) => {
    productController.create(req, res, next);
});
// PUT update product: Protected (admin, manager only)
router.put("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["admin", "manager"]), upload_1.uploadProductImage, convertFormData_middleware_1.convertFormData, (0, validate_middleware_1.validate)(product_validation_1.updateProductSchema), (req, res, next) => {
    productController.update(req, res, next);
});
// DELETE product: Protected (admin only)
router.delete("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["admin"]), (0, validate_middleware_1.validate)(product_validation_1.getProductByIdSchema), (req, res, next) => {
    productController.delete(req, res, next);
});
exports.default = router;
//# sourceMappingURL=product.routes.js.map