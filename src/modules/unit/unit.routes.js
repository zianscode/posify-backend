"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const unit_controller_1 = require("./unit.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const unit_validation_1 = require("./unit.validation");
const router = (0, express_1.Router)();
const unitController = new unit_controller_1.UnitController();
router.get("/", auth_middleware_1.authMiddleware, (req, res, next) => {
    unitController.list(req, res, next);
});
router.get("/:id", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(unit_validation_1.getUnitByIdSchema), (req, res, next) => {
    unitController.getById(req, res, next);
});
exports.default = router;
//# sourceMappingURL=unit.routes.js.map