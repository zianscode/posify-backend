import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();
const notificationController = new NotificationController();

router.use(authMiddleware);

router.get("/", (req, res, next) => {
  notificationController.findAll(req, res, next);
});

router.get("/unread-count", (req, res, next) => {
  notificationController.getUnreadCount(req, res, next);
});

router.patch("/:id/read", (req, res, next) => {
  notificationController.markAsRead(req, res, next);
});

router.patch("/read-all", (req, res, next) => {
  notificationController.markAllAsRead(req, res, next);
});

router.delete("/", (req, res, next) => {
  notificationController.deleteAll(req, res, next);
});

router.delete("/:id", (req, res, next) => {
  notificationController.delete(req, res, next);
});

export default router;
