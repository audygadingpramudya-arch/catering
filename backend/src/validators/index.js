import { z } from "zod";
import { AppError } from "../utils/AppError.js";

export function validate(schema, data) {
  const result = schema.safeParse(data);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => issue.message)
      .join(", ");

    throw new AppError(message, 422);
  }

  return result.data;
}

const booleanish = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return value === "true" || value === "1" || value === 1;
}, z.boolean());

const text = (label, min = 1, max = 255) =>
  z
    .string({ message: `${label} wajib diisi` })
    .trim()
    .min(min, `${label} minimal ${min} karakter`)
    .max(max, `${label} maksimal ${max} karakter`);

export const createMenuSchema = z.object({
  name: text("Nama menu", 2, 150),
  category: text("Kategori", 2, 100),
  price: z.coerce
    .number({ message: "Harga wajib berupa angka" })
    .int("Harga harus bilangan bulat")
    .nonnegative("Harga tidak boleh negatif"),
  description: z.string().trim().max(1000).optional().default(""),
  popular: booleanish.optional().default(false),
  is_active: booleanish.optional().default(true)
});

export const updateMenuSchema = z.object({
  name: text("Nama menu", 2, 150).optional(),
  category: text("Kategori", 2, 100).optional(),
  price: z.coerce
    .number()
    .int("Harga harus bilangan bulat")
    .nonnegative("Harga tidak boleh negatif")
    .optional(),
  description: z.string().trim().max(1000).optional(),
  popular: booleanish.optional(),
  is_active: booleanish.optional()
});

export const createTestimonialSchema = z.object({
  name: text("Nama", 2, 100),
  role: z.string().trim().max(100).optional().default("Pelanggan"),
  message: text("Pesan", 5, 1000),
  rating: z.coerce
    .number()
    .int("Rating harus bilangan bulat")
    .min(1, "Rating minimal 1")
    .max(5, "Rating maksimal 5")
    .optional()
    .default(5),
  is_active: booleanish.optional().default(true)
});

export const updateTestimonialSchema = z.object({
  name: text("Nama", 2, 100).optional(),
  role: z.string().trim().max(100).optional(),
  message: text("Pesan", 5, 1000).optional(),
  rating: z.coerce
    .number()
    .int("Rating harus bilangan bulat")
    .min(1, "Rating minimal 1")
    .max(5, "Rating maksimal 5")
    .optional(),
  is_active: booleanish.optional()
});

export const createGallerySchema = z.object({
  title: text("Judul", 2, 150),
  sort_order: z.coerce.number().int().optional().default(0)
});

export const updateGallerySchema = z.object({
  title: text("Judul", 2, 150).optional(),
  sort_order: z.coerce.number().int().optional()
});

export const updateSettingsSchema = z.object({
  business_name: text("Nama bisnis", 2, 150).optional(),
  tagline: z.string().trim().max(255).optional(),
  hero_title: text("Judul hero", 2, 255).optional(),
  hero_description: z.string().trim().max(1000).optional(),
  about_title: z.string().trim().max(255).optional(),
  about_description: z.string().trim().max(2000).optional(),
  whatsapp: z.string().trim().max(30).optional(),
  instagram: z.string().trim().max(255).optional(),
  facebook: z.string().trim().max(255).optional(),
  address: z.string().trim().max(255).optional(),
  opening_hours: z.string().trim().max(150).optional(),
  maps_url: z.string().trim().max(500).optional()
});
