import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../shared/errors";

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError("Pengguna belum terautentikasi"));
    }

    const hasRole = allowedRoles.some(
      (role) => role.toLowerCase() === req.user?.role.toLowerCase()
    );
    
    if (!hasRole) {
      return next(new ForbiddenError("Anda tidak memiliki hak akses untuk aksi ini"));
    }

    next();
  };
};
