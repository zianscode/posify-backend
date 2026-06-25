"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const errors_1 = require("../shared/errors");
const helpers_1 = require("../shared/helpers");
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new errors_1.UnauthorizedError("Token otentikasi tidak disediakan");
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new errors_1.UnauthorizedError("Token otentikasi tidak valid");
        }
        const decoded = (0, helpers_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof errors_1.UnauthorizedError) {
            next(error);
        }
        else {
            console.error("Auth error:", error);
            next(new errors_1.UnauthorizedError("Token kadaluarsa atau tidak valid"));
        }
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map