"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const router = (0, express_1.Router)();
const adminController = new admin_controller_1.AdminController();
router.use(auth_middleware_1.authMiddleware);
router.use((0, role_middleware_1.roleMiddleware)(["admin"]));
router.post("/reset-data", (req, res, next) => {
    adminController.resetData(req, res, next);
});
exports.default = router;
//# sourceMappingURL=admin.routes.js.map