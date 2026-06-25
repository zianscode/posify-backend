"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingController = void 0;
const setting_service_1 = require("./setting.service");
const response_1 = require("../../shared/response");
const settingService = new setting_service_1.SettingService();
class SettingController {
    async create(req, res, next) {
        try {
            const { key, value, description } = req.body;
            const result = await settingService.createSetting(key, value, description);
            (0, response_1.sendSuccess)({
                res,
                statusCode: 201,
                message: "Setting berhasil dibuat",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async list(req, res, next) {
        try {
            const result = await settingService.getSettings();
            (0, response_1.sendSuccess)({
                res,
                message: "Daftar setting berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const result = await settingService.getSettingById(id);
            (0, response_1.sendSuccess)({
                res,
                message: "Detail setting berhasil diambil",
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
            const { value, description } = req.body;
            const result = await settingService.updateSetting(id, value, description);
            (0, response_1.sendSuccess)({
                res,
                message: "Setting berhasil diperbarui",
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
            await settingService.deleteSetting(id);
            (0, response_1.sendSuccess)({
                res,
                message: "Setting berhasil dihapus",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SettingController = SettingController;
//# sourceMappingURL=setting.controller.js.map