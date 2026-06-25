"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const errors_1 = require("../shared/errors");
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new errors_1.UnauthorizedError("Pengguna belum terautentikasi"));
        }
        const hasRole = allowedRoles.some((role) => role.toLowerCase() === req.user?.role.toLowerCase());
        if (!hasRole) {
            return next(new errors_1.ForbiddenError("Anda tidak memiliki hak akses untuk aksi ini"));
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
//# sourceMappingURL=role.middleware.js.map