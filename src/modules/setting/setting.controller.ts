import { Request, Response, NextFunction } from "express";
import { SettingService } from "./setting.service";
import { sendSuccess } from "../../shared/response";

const settingService = new SettingService();

export class SettingController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { key, value, description } = req.body;
      const result = await settingService.createSetting(key, value, description);

      sendSuccess({
        res,
        statusCode: 201,
        message: "Setting berhasil dibuat",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await settingService.getSettings();

      sendSuccess({
        res,
        message: "Daftar setting berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await settingService.getSettingById(id);

      sendSuccess({
        res,
        message: "Detail setting berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { value, description } = req.body;
      const result = await settingService.updateSetting(id, value, description);

      sendSuccess({
        res,
        message: "Setting berhasil diperbarui",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await settingService.deleteSetting(id);

      sendSuccess({
        res,
        message: "Setting berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }
}
