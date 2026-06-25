"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const category_validation_1 = require("./category.validation");
const router = (0, express_1.Router)();
const categoryController = new category_controller_1.CategoryController();
router.get("/", auth_middleware_1.authMiddleware, (req, res, next) => {
    categoryController.list(req, res, next);
});
router.get("/:id", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(category_validation_1.getCategoryByIdSchema), (req, res, next) => {
    categoryController.getById(req, res, next);
});
exports.default = router;
//# sourceMappingURL=category.routes.js.map