"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
require("dotenv/config");
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().min(1, "DATABASE_URL is required"),
    JWT_SECRET: zod_1.z.string().min(1, "JWT_SECRET is required"),
    PORT: zod_1.z.preprocess((val) => {
        if (val === undefined || val === null || val === "")
            return 5000;
        const num = Number(val);
        return isNaN(num) ? 5000 : num;
    }, zod_1.z.number().int().positive()),
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    // Email (SMTP)
    SMTP_HOST: zod_1.z.string().min(1, "SMTP_HOST is required"),
    SMTP_PORT: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().int().positive()),
    SMTP_USER: zod_1.z.string().min(1, "SMTP_USER is required"),
    SMTP_PASS: zod_1.z.string().min(1, "SMTP_PASS is required"),
    // Google OAuth
    GOOGLE_CLIENT_ID: zod_1.z.string().min(1, "GOOGLE_CLIENT_ID is required"),
    // Client URL (for password reset link)
    CLIENT_URL: zod_1.z.string().url("CLIENT_URL must be a valid URL").default("http://localhost:5173"),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(JSON.stringify(parsed.error.format(), null, 2));
    process.exit(1);
}
exports.env = parsed.data;
//# sourceMappingURL=env.js.map