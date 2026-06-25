"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
router.use(auth_middleware_1.authMiddleware);
router.use((0, role_middleware_1.roleMiddleware)(["admin"]));
router.get("/", (0, validate_middleware_1.validate)(user_validation_1.listUsersSchema), (req, res, next) => {
    userController.list(req, res, next);
});
router.get("/:id", (0, validate_middleware_1.validate)(user_validation_1.getUserByIdSchema), (req, res, next) => {
    userController.getById(req, res, next);
});
router.post("/", (0, validate_middleware_1.validate)(user_validation_1.createUserSchema), (req, res, next) => {
    userController.create(req, res, next);
});
router.put("/:id", (0, validate_middleware_1.validate)(user_validation_1.updateUserSchema), (req, res, next) => {
    userController.update(req, res, next);
});
router.delete("/:id", (0, validate_middleware_1.validate)(user_validation_1.deleteUserSchema), (req, res, next) => {
    userController.delete(req, res, next);
});
router.put("/:id/reset-password", (0, validate_middleware_1.validate)(user_validation_1.resetPasswordSchema), (req, res, next) => {
    userController.resetPassword(req, res, next);
});
exports.default = router;
//# sourceMappingURL=user.routes.js.map