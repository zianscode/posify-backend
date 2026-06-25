"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addon_controller_1 = require("./addon.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const addon_validation_1 = require("./addon.validation");
const router = (0, express_1.Router)();
const addOnController = new addon_controller_1.AddOnController();
router.get("/", auth_middleware_1.authMiddleware, (req, res, next) => {
    addOnController.list(req, res, next);
});
router.get("/:id", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(addon_validation_1.getAddOnByIdSchema), (req, res, next) => {
    addOnController.getById(req, res, next);
});
router.post("/", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["admin"]), (0, validate_middleware_1.validate)(addon_validation_1.createAddOnSchema), (req, res, next) => {
    addOnController.create(req, res, next);
});
router.put("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["admin"]), (0, validate_middleware_1.validate)(addon_validation_1.updateAddOnSchema), (req, res, next) => {
    addOnController.update(req, res, next);
});
router.delete("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["admin"]), (0, validate_middleware_1.validate)(addon_validation_1.getAddOnByIdSchema), (req, res, next) => {
    addOnController.delete(req, res, next);
});
exports.default = router;
//# sourceMappingURL=addon.routes.js.map