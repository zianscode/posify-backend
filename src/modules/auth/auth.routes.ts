import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { uploadAvatar as uploadAvatarMiddleware } from "../../config/upload";
import {
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  updateProfileSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleAuthSchema,
} from "./auth.validation";

const router = Router();
const authController = new AuthController();

// Public
router.post("/login", validate(loginSchema), (req, res, next) => {
  authController.login(req, res, next);
});

router.post("/refresh", validate(refreshTokenSchema), (req, res, next) => {
  authController.refreshToken(req, res, next);
});

router.post("/register", validate(registerSchema), (req, res, next) => {
  authController.register(req, res, next);
});

router.post("/forgot-password", validate(forgotPasswordSchema), (req, res, next) => {
  authController.forgotPassword(req, res, next);
});

router.post("/reset-password", validate(resetPasswordSchema), (req, res, next) => {
  authController.resetPassword(req, res, next);
});

router.post("/google", validate(googleAuthSchema), (req, res, next) => {
  authController.googleAuth(req, res, next);
});

// Protected
router.post("/logout", authMiddleware, (req, res, next) => {
  authController.logout(req, res, next);
});

router.get("/profile", authMiddleware, (req, res, next) => {
  authController.profile(req, res, next);
});

router.put(
  "/change-password",
  authMiddleware,
  validate(changePasswordSchema),
  (req, res, next) => {
    authController.changePassword(req, res, next);
  },
);

router.put(
  "/profile",
  authMiddleware,
  validate(updateProfileSchema),
  (req, res, next) => {
    authController.updateProfile(req, res, next);
  },
);

router.post(
  "/avatar",
  authMiddleware,
  (req, res, next) => {
    uploadAvatarMiddleware(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  },
  (req, res, next) => {
    authController.uploadAvatar(req, res, next);
  },
);

export default router;
