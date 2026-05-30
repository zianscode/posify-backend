import { Request, Response, NextFunction } from "express";
import { HttpError } from "../shared/errors";
import { sendError } from "../shared/response";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error in development/console
  console.error("❌ Error encountered:", err);

  if (err instanceof HttpError) {
    return sendError({
      res,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
  }

  // Handle Prisma unique constraint violation code P2002
  if (err.code === "P2002") {
    const fields = err.meta?.target ? (err.meta.target as string[]).join(", ") : "field";
    return sendError({
      res,
      statusCode: 409,
      message: `Data dengan ${fields} tersebut sudah terdaftar`,
    });
  }

  // Handle Prisma record not found code P2025
  if (err.code === "P2025") {
    return sendError({
      res,
      statusCode: 404,
      message: (err.meta?.cause as string) || "Data tidak ditemukan",
    });
  }

  // Fallback to internal server error
  return sendError({
    res,
    statusCode: 500,
    message: "Terjadi kesalahan internal pada server",
  });
};
