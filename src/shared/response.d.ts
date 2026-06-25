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
export declare const sendSuccess: <T>({ res, statusCode, message, data, meta, }: SuccessResponseParams<T>) => Response<any, Record<string, any>>;
export declare const sendError: ({ res, statusCode, message, errors, }: ErrorResponseParams) => Response<any, Record<string, any>>;
//# sourceMappingURL=response.d.ts.map