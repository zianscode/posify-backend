import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../shared/errors";
import { verifyToken, TokenPayload } from "../shared/helpers";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token otentikasi tidak disediakan");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("Token otentikasi tidak valid");
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      console.error("Auth error:", error);
      next(new UnauthorizedError("Token kadaluarsa atau tidak valid"));
    }
  }
};
