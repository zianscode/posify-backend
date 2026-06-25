"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const response_1 = require("../../shared/response");
const userService = new user_service_1.UserService();
class UserController {
    async create(req, res, next) {
        try {
            const { name, email, password, roleId, outletId } = req.body;
            const result = await userService.createUser({
                name,
                email,
                password,
                roleId,
                outletId,
            });
            (0, response_1.sendSuccess)({
                res,
                statusCode: 201,
                message: "User berhasil dibuat",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async list(req, res, next) {
        try {
            const { page = 1, limit = 10, search, roleId, outletId } = req.query;
            const result = await userService.getUsers({
                page: Number(page),
                limit: Number(limit),
                ...(search ? { search } : {}),
                ...(roleId ? { roleId: Number(roleId) } : {}),
                ...(outletId ? { outletId: Number(outletId) } : {}),
            });
            (0, response_1.sendSuccess)({
                res,
                message: "Daftar user berhasil diambil",
                data: result.data,
                meta: result.meta,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const result = await userService.getUserById(id);
            (0, response_1.sendSuccess)({
                res,
                message: "Detail user berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            const { name, email, roleId, outletId } = req.body;
            const result = await userService.updateUser(id, {
                name,
                email,
                roleId,
                outletId,
            });
            (0, response_1.sendSuccess)({
                res,
                message: "User berhasil diperbarui",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const id = Number(req.params.id);
            const currentUserId = req.user.userId;
            await userService.deleteUser(id, currentUserId);
            (0, response_1.sendSuccess)({
                res,
                message: "User berhasil dihapus",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        try {
            const id = Number(req.params.id);
            const { password } = req.body;
            await userService.resetPassword(id, password);
            (0, response_1.sendSuccess)({
                res,
                message: "Password user berhasil direset",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map