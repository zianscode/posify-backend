"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errors_1 = require("../shared/errors");
const response_1 = require("../shared/response");
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof errors_1.HttpError) {
        if (err.statusCode >= 500) {
            console.error("❌ Error encountered:", err);
        }
        return (0, response_1.sendError)({
            res,
            statusCode: err.statusCode,
            message: err.message,
            errors: err.errors,
        });
    }
    // Handle Prisma unique constraint violation code P2002
    if (err.code === "P2002") {
        const fields = err.meta?.target ? err.meta.target.join(", ") : "field";
        return (0, response_1.sendError)({
            res,
            statusCode: 409,
            message: `Data dengan ${fields} tersebut sudah terdaftar`,
        });
    }
    // Handle Prisma record not found code P2025
    if (err.code === "P2025") {
        return (0, response_1.sendError)({
            res,
            statusCode: 404,
            message: err.meta?.cause || "Data tidak ditemukan",
        });
    }
    // Fallback to internal server error
    return (0, response_1.sendError)({
        res,
        statusCode: 500,
        message: "Terjadi kesalahan internal pada server",
    });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map