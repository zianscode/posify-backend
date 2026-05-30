import { Router } from "express";
import { UnitController } from "./unit.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  createUnitSchema,
  updateUnitSchema,
  getUnitByIdSchema,
} from "./unit.validation";

const router = Router();
const unitController = new UnitController();

// GET all units: Protected (admin, manager, kasir)
router.get("/", authMiddleware, (req, res, next) => {
  unitController.list(req, res, next);
});

// GET unit by ID: Protected (admin, manager, kasir)
router.get("/:id", authMiddleware, validate(getUnitByIdSchema), (req, res, next) => {
  unitController.getById(req, res, next);
});

// POST create unit: Protected (admin, manager only)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  validate(createUnitSchema),
  (req, res, next) => {
    unitController.create(req, res, next);
  }
);

// PUT update unit: Protected (admin, manager only)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  validate(updateUnitSchema),
  (req, res, next) => {
    unitController.update(req, res, next);
  }
);

// DELETE unit: Protected (admin, manager only)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  validate(getUnitByIdSchema),
  (req, res, next) => {
    unitController.delete(req, res, next);
  }
);

export default router;
