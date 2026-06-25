"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("./notification.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const notificationController = new notification_controller_1.NotificationController();
router.use(auth_middleware_1.authMiddleware);
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
exports.default = router;
//# sourceMappingURL=notification.routes.js.map