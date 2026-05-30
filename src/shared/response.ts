import { Response } from "express";

export interface SuccessResponseParams<T> {
  res: Response;
  statusCode?: number | undefined;
  message?: string | undefined;
  data?: T | undefined;
  meta?: {
    page?: number | undefined;
    limit?: number | undefined;
    total?: number | undefined;
    totalPages?: number | undefined;
    [key: string]: any;
  } | undefined;
}

export interface ErrorDetail {
  field?: string | undefined;
  msg: string;
}

export interface ErrorResponseParams {
  res: Response;
  statusCode?: number | undefined;
  message: string;
  errors?: ErrorDetail[] | undefined;
}

export const sendSuccess = <T>({
  res,
  statusCode = 200,
  message = "Data berhasil diproses",
  data,
  meta,
}: SuccessResponseParams<T>) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    ...(data !== undefined ? { data } : {}),
    ...(meta !== undefined ? { meta } : {}),
  });
};

export const sendError = ({
  res,
  statusCode = 500,
  message = "Terjadi kesalahan pada server",
  errors,
}: ErrorResponseParams) => {
  return res.status(statusCode).json({
    status: "error",
    message,
    ...(errors !== undefined ? { errors } : {}),
  });
};
