import { Request, Response, NextFunction } from "express";
import { AddOnService } from "./addon.service";
import { sendSuccess } from "../../shared/response";

const addOnService = new AddOnService();

export class AddOnController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, price, description } = req.body;
      const result = await addOnService.createAddOn(name, price, description);

      sendSuccess({
        res,
        statusCode: 201,
        message: "Add-on berhasil dibuat",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await addOnService.getAddOns();

      sendSuccess({
        res,
        message: "Daftar add-on berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await addOnService.getAddOnById(id);

      sendSuccess({
        res,
        message: "Detail add-on berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { name, price, description } = req.body;
      const result = await addOnService.updateAddOn(id, { name, price, description });

      sendSuccess({
        res,
        message: "Add-on berhasil diperbarui",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await addOnService.deleteAddOn(id);

      sendSuccess({
        res,
        message: "Add-on berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }
}
