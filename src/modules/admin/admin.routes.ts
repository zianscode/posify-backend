import { Router } from "express";
import { AdminController } from "./admin.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();
const adminController = new AdminController();

router.use(authMiddleware);
router.use(roleMiddleware(["admin"]));

router.post("/reset-data", (req, res, next) => {
  adminController.resetData(req, res, next);
});

export default router;
