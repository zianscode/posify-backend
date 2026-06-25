"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const setting_controller_1 = require("./setting.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const setting_validation_1 = require("./setting.validation");
const router = (0, express_1.Router)();
const settingController = new setting_controller_1.SettingController();
// GET all settings: Protected (all roles)
router.get("/", auth_middleware_1.authMiddleware, (req, res, next) => {
    settingController.list(req, res, next);
});
// GET setting by ID: Protected (all roles)
router.get("/:id", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(setting_validation_1.getSettingByIdSchema), (req, res, next) => {
    settingController.getById(req, res, next);
});
// POST create setting: Protected (admin only)
router.post("/", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["admin"]), (0, validate_middleware_1.validate)(setting_validation_1.createSettingSchema), (req, res, next) => {
    settingController.create(req, res, next);
});
// PUT update setting: Protected (admin only)
router.put("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["admin"]), (0, validate_middleware_1.validate)(setting_validation_1.updateSettingSchema), (req, res, next) => {
    settingController.update(req, res, next);
});
// DELETE setting: Protected (admin only)
router.delete("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["admin"]), (0, validate_middleware_1.validate)(setting_validation_1.getSettingByIdSchema), (req, res, next) => {
    settingController.delete(req, res, next);
});
exports.default = router;
//# sourceMappingURL=setting.routes.js.map