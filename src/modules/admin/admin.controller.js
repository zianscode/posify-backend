"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = require("./admin.service");
const response_1 = require("../../shared/response");
const adminService = new admin_service_1.AdminService();
class AdminController {
    async resetData(req, res, next) {
        try {
            const result = await adminService.resetData();
            (0, response_1.sendSuccess)({ res, message: result.message });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map