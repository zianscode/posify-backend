import { Router } from "express";
import { AddOnController } from "./addon.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  createAddOnSchema,
  updateAddOnSchema,
  getAddOnByIdSchema,
} from "./addon.validation";

const router = Router();
const addOnController = new AddOnController();

router.get("/", authMiddleware, (req, res, next) => {
  addOnController.list(req, res, next);
});

router.get("/:id", authMiddleware, validate(getAddOnByIdSchema), (req, res, next) => {
  addOnController.getById(req, res, next);
});

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  validate(createAddOnSchema),
  (req, res, next) => {
    addOnController.create(req, res, next);
  }
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  validate(updateAddOnSchema),
  (req, res, next) => {
    addOnController.update(req, res, next);
  }
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  validate(getAddOnByIdSchema),
  (req, res, next) => {
    addOnController.delete(req, res, next);
  }
);

export default router;
