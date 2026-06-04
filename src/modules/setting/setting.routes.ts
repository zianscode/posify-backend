import { Router } from "express";
import { SettingController } from "./setting.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  createSettingSchema,
  updateSettingSchema,
  getSettingByIdSchema,
} from "./setting.validation";

const router = Router();
const settingController = new SettingController();

// GET all settings: Protected (all roles)
router.get("/", authMiddleware, (req, res, next) => {
  settingController.list(req, res, next);
});

// GET setting by ID: Protected (all roles)
router.get("/:id", authMiddleware, validate(getSettingByIdSchema), (req, res, next) => {
  settingController.getById(req, res, next);
});

// POST create setting: Protected (admin only)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  validate(createSettingSchema),
  (req, res, next) => {
    settingController.create(req, res, next);
  },
);

// PUT update setting: Protected (admin only)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  validate(updateSettingSchema),
  (req, res, next) => {
    settingController.update(req, res, next);
  },
);

// DELETE setting: Protected (admin only)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  validate(getSettingByIdSchema),
  (req, res, next) => {
    settingController.delete(req, res, next);
  },
);

export default router;
