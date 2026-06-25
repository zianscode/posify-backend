"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const prisma_1 = require("../generated/prisma");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = __importDefault(require("pg"));
const env_1 = require("./env");
const pool = new pg_1.default.Pool({ connectionString: env_1.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
exports.prisma = globalThis.prisma ||
    new prisma_1.PrismaClient({
        adapter,
        log: env_1.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
if (env_1.env.NODE_ENV !== "production") {
    globalThis.prisma = exports.prisma;
}
//# sourceMappingURL=database.js.map