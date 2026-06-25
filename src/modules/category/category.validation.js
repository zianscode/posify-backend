"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryByIdSchema = void 0;
const zod_1 = require("zod");
exports.getCategoryByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number({
            message: "ID kategori harus berupa angka",
        }),
    }),
});
//# sourceMappingURL=category.validation.js.map