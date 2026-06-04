import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token wajib diisi"),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string({ message: "Password saat ini wajib diisi" })
      .min(1, "Password saat ini tidak boleh kosong"),
    newPassword: z
      .string({ message: "Password baru wajib diisi" })
      .min(8, "Password baru minimal 8 karakter"),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Nama wajib diisi" })
      .min(1, "Nama tidak boleh kosong")
      .max(100, "Nama maksimal 100 karakter")
      .optional(),
    email: z
      .string({ message: "Email wajib diisi" })
      .min(1, "Email tidak boleh kosong")
      .email("Format email tidak valid")
      .optional(),
  }),
});
