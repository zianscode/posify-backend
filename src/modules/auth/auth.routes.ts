import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { loginSchema, refreshTokenSchema } from "./auth.validation";

const router = Router();
const authController = new AuthController();

// Public: POST /api/v1/auth/login
router.post("/login", validate(loginSchema), (req, res, next) => {
  authController.login(req, res, next);
});

// Public: POST /api/v1/auth/refresh
router.post("/refresh", validate(refreshTokenSchema), (req, res, next) => {
  authController.refreshToken(req, res, next);
});

// Protected: POST /api/v1/auth/logout
router.post("/logout", authMiddleware, (req, res, next) => {
  authController.logout(req, res, next);
});

export default router;
