export declare class HttpError extends Error {
    readonly statusCode: number;
    readonly errors?: any[] | undefined;
    constructor(message: string, statusCode: number, errors?: any[] | undefined);
}
export declare class BadRequestError extends HttpError {
    constructor(message?: string, errors?: any[]);
}
export declare class UnauthorizedError extends HttpError {
    constructor(message?: string);
}
export declare class ForbiddenError extends HttpError {
    constructor(message?: string);
}
export declare class NotFoundError extends HttpError {
    constructor(message?: string);
}
export declare class ConflictError extends HttpError {
    constructor(message?: string);
}
export declare class InternalServerError extends HttpError {
    constructor(message?: string);
}
//# sourceMappingURL=errors.d.ts.map