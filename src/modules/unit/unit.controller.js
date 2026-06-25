"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitController = void 0;
const unit_service_1 = require("./unit.service");
const response_1 = require("../../shared/response");
const unitService = new unit_service_1.UnitService();
class UnitController {
    async list(req, res, next) {
        try {
            const result = await unitService.getUnits();
            (0, response_1.sendSuccess)({
                res,
                message: "Daftar unit berhasil diambil",
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
            const result = await unitService.getUnitById(id);
            (0, response_1.sendSuccess)({
                res,
                message: "Detail unit berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UnitController = UnitController;
//# sourceMappingURL=unit.controller.js.map