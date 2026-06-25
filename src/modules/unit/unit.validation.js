"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnitByIdSchema = void 0;
const zod_1 = require("zod");
exports.getUnitByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number({
            message: "ID unit harus berupa angka",
        }),
    }),
});
//# sourceMappingURL=unit.validation.js.map