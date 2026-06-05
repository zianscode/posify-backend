import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  createUserSchema,
  updateUserSchema,
  getUserByIdSchema,
  deleteUserSchema,
  resetPasswordSchema,
  listUsersSchema,
} from "./user.validation";

const router = Router();
const userController = new UserController();

router.use(authMiddleware);
router.use(roleMiddleware(["admin"]));

router.get("/", validate(listUsersSchema), (req, res, next) => {
  userController.list(req, res, next);
});

router.get("/:id", validate(getUserByIdSchema), (req, res, next) => {
  userController.getById(req, res, next);
});

router.post("/", validate(createUserSchema), (req, res, next) => {
  userController.create(req, res, next);
});

router.put("/:id", validate(updateUserSchema), (req, res, next) => {
  userController.update(req, res, next);
});

router.delete("/:id", validate(deleteUserSchema), (req, res, next) => {
  userController.delete(req, res, next);
});

router.put(
  "/:id/reset-password",
  validate(resetPasswordSchema),
  (req, res, next) => {
    userController.resetPassword(req, res, next);
  },
);

export default router;
