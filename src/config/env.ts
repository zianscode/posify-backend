import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  PORT: z.preprocess((val) => {
    if (val === undefined || val === null || val === "") return 5000;
    const num = Number(val);
    return isNaN(num) ? 5000 : num;
  }, z.number().int().positive()),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Email (SMTP)
  SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
  SMTP_PORT: z.preprocess((val) => Number(val), z.number().int().positive()),
  SMTP_USER: z.string().min(1, "SMTP_USER is required"),
  SMTP_PASS: z.string().min(1, "SMTP_PASS is required"),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),

  // Client URL (for password reset link)
  CLIENT_URL: z.string().url("CLIENT_URL must be a valid URL").default("http://localhost:5173"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;
