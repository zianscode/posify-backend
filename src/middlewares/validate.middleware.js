"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const errors_1 = require("../shared/errors");
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const parsed = (await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            }));
            // Update request properties with validated/coerced values
            if (parsed.body)
                req.body = parsed.body;
            if (parsed.query) {
                // Express v5: req.query is getter-only, use Object.defineProperty
                Object.defineProperty(req, "query", {
                    value: parsed.query,
                    writable: true,
                    configurable: true,
                });
            }
            if (parsed.params)
                req.params = parsed.params;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorDetails = error.issues.map((err) => ({
                    field: err.path.slice(1).join("."), // strip first path element (body/query/params)
                    msg: err.message,
                }));
                next(new errors_1.BadRequestError("Validasi input gagal", errorDetails));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map