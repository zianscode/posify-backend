import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { sendSuccess } from "../../shared/response";

const userService = new UserService();

export class UserController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, roleId, outletId } = req.body;
      const result = await userService.createUser({
        name,
        email,
        password,
        roleId,
        outletId,
      });

      sendSuccess({
        res,
        statusCode: 201,
        message: "User berhasil dibuat",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search, roleId, outletId } = req.query as any;
      const result = await userService.getUsers({
        page: Number(page),
        limit: Number(limit),
        ...(search ? { search } : {}),
        ...(roleId ? { roleId: Number(roleId) } : {}),
        ...(outletId ? { outletId: Number(outletId) } : {}),
      });

      sendSuccess({
        res,
        message: "Daftar user berhasil diambil",
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await userService.getUserById(id);

      sendSuccess({
        res,
        message: "Detail user berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { name, email, roleId, outletId } = req.body;
      const result = await userService.updateUser(id, {
        name,
        email,
        roleId,
        outletId,
      });

      sendSuccess({
        res,
        message: "User berhasil diperbarui",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const currentUserId = req.user!.userId;
      await userService.deleteUser(id, currentUserId);

      sendSuccess({
        res,
        message: "User berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { password } = req.body;
      await userService.resetPassword(id, password);

      sendSuccess({
        res,
        message: "Password user berhasil direset",
      });
    } catch (error) {
      next(error);
    }
  }
}
