import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Nama wajib diisi" })
      .min(1, "Nama tidak boleh kosong")
      .max(100, "Nama maksimal 100 karakter"),
    email: z
      .string({ message: "Email wajib diisi" })
      .min(1, "Email tidak boleh kosong")
      .email("Format email tidak valid"),
    password: z
      .string({ message: "Password wajib diisi" })
      .min(8, "Password minimal 8 karakter"),
    roleId: z
      .number({ message: "Role wajib dipilih" })
      .int("Role harus berupa angka"),
    outletId: z
      .number({ message: "Outlet harus berupa angka" })
      .int("Outlet harus berupa angka")
      .nullable()
      .optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.coerce.number({ message: "ID user harus berupa angka" }),
  }),
  body: z.object({
    name: z
      .string()
      .min(1, "Nama tidak boleh kosong")
      .max(100, "Nama maksimal 100 karakter")
      .optional(),
    email: z
      .string()
      .min(1, "Email tidak boleh kosong")
      .email("Format email tidak valid")
      .optional(),
    roleId: z
      .number()
      .int("Role harus berupa angka")
      .optional(),
    outletId: z
      .number()
      .int("Outlet harus berupa angka")
      .nullable()
      .optional(),
  }),
});

export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number({ message: "ID user harus berupa angka" }),
  }),
});

export const deleteUserSchema = z.object({
  params: z.object({
    id: z.coerce.number({ message: "ID user harus berupa angka" }),
  }),
});

export const resetPasswordSchema = z.object({
  params: z.object({
    id: z.coerce.number({ message: "ID user harus berupa angka" }),
  }),
  body: z.object({
    password: z
      .string({ message: "Password wajib diisi" })
      .min(8, "Password minimal 8 karakter"),
  }),
});

export const listUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
    search: z.string().optional(),
    roleId: z.coerce.number().int().optional(),
    outletId: z.coerce.number().int().optional(),
  }),
});
