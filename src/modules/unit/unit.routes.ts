import { Router } from "express";
import { UnitController } from "./unit.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { getUnitByIdSchema } from "./unit.validation";

const router = Router();
const unitController = new UnitController();

router.get("/", authMiddleware, (req, res, next) => {
  unitController.list(req, res, next);
});

router.get("/:id", authMiddleware, validate(getUnitByIdSchema), (req, res, next) => {
  unitController.getById(req, res, next);
});

export default router;
