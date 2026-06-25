"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFormData = void 0;
const NUMBER_FIELDS = [
    "price",
    "costPrice",
    "cost_price",
    "stock",
    "minStock",
    "min_stock",
    "categoryId",
    "category_id",
    "unitId",
    "unit_id",
    "discount",
    "tax",
    "paidAmount",
    "paid_amount",
    "quantity",
    "addOnIds",
];
const convertFormData = (req, _res, next) => {
    if (req.body && typeof req.body === "object" && !Array.isArray(req.body)) {
        for (const key of Object.keys(req.body)) {
            if (NUMBER_FIELDS.includes(key) && typeof req.body[key] === "string") {
                const trimmed = req.body[key].trim();
                if (trimmed === "") {
                    delete req.body[key];
                }
                else {
                    const num = Number(trimmed);
                    req.body[key] = isNaN(num) ? req.body[key] : num;
                }
            }
        }
    }
    next();
};
exports.convertFormData = convertFormData;
//# sourceMappingURL=convertFormData.middleware.js.map