import { Request, Response, NextFunction } from "express";
import { UnitService } from "./unit.service";
import { sendSuccess } from "../../shared/response";

const unitService = new UnitService();

export class UnitController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await unitService.getUnits();

      sendSuccess({
        res,
        message: "Daftar unit berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await unitService.getUnitById(id);

      sendSuccess({
        res,
        message: "Detail unit berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
