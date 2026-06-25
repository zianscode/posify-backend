"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = ({ res, statusCode = 200, message = "Data berhasil diproses", data, meta, }) => {
    return res.status(statusCode).json({
        status: "success",
        message,
        ...(data !== undefined ? { data } : {}),
        ...(meta !== undefined ? { meta } : {}),
    });
};
exports.sendSuccess = sendSuccess;
const sendError = ({ res, statusCode = 500, message = "Terjadi kesalahan pada server", errors, }) => {
    return res.status(statusCode).json({
        status: "error",
        message,
        ...(errors !== undefined ? { errors } : {}),
    });
};
exports.sendError = sendError;
//# sourceMappingURL=response.js.map