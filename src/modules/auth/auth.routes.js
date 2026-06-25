"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const upload_1 = require("../../config/upload");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
// Public
router.post("/login", (0, validate_middleware_1.validate)(auth_validation_1.loginSchema), (req, res, next) => {
    authController.login(req, res, next);
});
router.post("/refresh", (0, validate_middleware_1.validate)(auth_validation_1.refreshTokenSchema), (req, res, next) => {
    authController.refreshToken(req, res, next);
});
router.post("/register", (0, validate_middleware_1.validate)(auth_validation_1.registerSchema), (req, res, next) => {
    authController.register(req, res, next);
});
router.post("/forgot-password", (0, validate_middleware_1.validate)(auth_validation_1.forgotPasswordSchema), (req, res, next) => {
    authController.forgotPassword(req, res, next);
});
router.post("/reset-password", (0, validate_middleware_1.validate)(auth_validation_1.resetPasswordSchema), (req, res, next) => {
    authController.resetPassword(req, res, next);
});
router.post("/google", (0, validate_middleware_1.validate)(auth_validation_1.googleAuthSchema), (req, res, next) => {
    authController.googleAuth(req, res, next);
});
// Protected
router.post("/logout", auth_middleware_1.authMiddleware, (req, res, next) => {
    authController.logout(req, res, next);
});
router.get("/profile", auth_middleware_1.authMiddleware, (req, res, next) => {
    authController.profile(req, res, next);
});
router.put("/change-password", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(auth_validation_1.changePasswordSchema), (req, res, next) => {
    authController.changePassword(req, res, next);
});
router.put("/profile", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(auth_validation_1.updateProfileSchema), (req, res, next) => {
    authController.updateProfile(req, res, next);
});
router.post("/avatar", auth_middleware_1.authMiddleware, (req, res, next) => {
    (0, upload_1.uploadAvatar)(req, res, (err) => {
        if (err)
            return next(err);
        next();
    });
}, (req, res, next) => {
    authController.uploadAvatar(req, res, next);
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map