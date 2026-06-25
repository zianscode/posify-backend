"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddOnController = void 0;
const addon_service_1 = require("./addon.service");
const response_1 = require("../../shared/response");
const addOnService = new addon_service_1.AddOnService();
class AddOnController {
    async create(req, res, next) {
        try {
            const { name, price, description } = req.body;
            const result = await addOnService.createAddOn(name, price, description);
            (0, response_1.sendSuccess)({
                res,
                statusCode: 201,
                message: "Add-on berhasil dibuat",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async list(req, res, next) {
        try {
            const result = await addOnService.getAddOns();
            (0, response_1.sendSuccess)({
                res,
                message: "Daftar add-on berhasil diambil",
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
            const result = await addOnService.getAddOnById(id);
            (0, response_1.sendSuccess)({
                res,
                message: "Detail add-on berhasil diambil",
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
            const { name, price, description } = req.body;
            const result = await addOnService.updateAddOn(id, { name, price, description });
            (0, response_1.sendSuccess)({
                res,
                message: "Add-on berhasil diperbarui",
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
            await addOnService.deleteAddOn(id);
            (0, response_1.sendSuccess)({
                res,
                message: "Add-on berhasil dihapus",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AddOnController = AddOnController;
//# sourceMappingURL=addon.controller.js.map