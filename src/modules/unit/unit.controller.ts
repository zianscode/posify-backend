import { Request, Response, NextFunction } from "express";
import { UnitService } from "./unit.service";
import { sendSuccess } from "../../shared/response";

const unitService = new UnitService();

export class UnitController {
  /**
   * Handle create unit request
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const result = await unitService.createUnit(name);

      sendSuccess({
        res,
        statusCode: 201,
        message: "Unit berhasil dibuat",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle list units request
   */
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

  /**
   * Handle get unit by ID request
   */
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

  /**
   * Handle update unit request
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { name } = req.body;
      const result = await unitService.updateUnit(id, name);

      sendSuccess({
        res,
        message: "Unit berhasil diperbarui",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle delete unit request
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await unitService.deleteUnit(id);

      sendSuccess({
        res,
        message: "Unit berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }
}
