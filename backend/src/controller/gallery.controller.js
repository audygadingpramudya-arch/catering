import db from "../config/database.js";
import { deleteImage, imageUrlFromFile } from "../services/image.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import {
  createGallerySchema,
  updateGallerySchema,
  validate
} from "../validators/index.js";

function serializeGallery(item) {
  return {
    ...item,
    sort_order: Number(item.sort_order)
  };
}

export const getGallery = asyncHandler(async (req, res) => {
  const [items] = await db.execute(
    "SELECT * FROM gallery ORDER BY sort_order ASC, id ASC"
  );

  res.json({
    success: true,
    data: items.map(serializeGallery)
  });
});

export const createGallery = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("Foto galeri wajib diunggah", 422);
  }

  const data = validate(createGallerySchema, req.body);
  const image = imageUrlFromFile(req.file, "gallery");

  const [result] = await db.execute(
    "INSERT INTO gallery (title, image, sort_order) VALUES (?, ?, ?)",
    [data.title, image, data.sort_order]
  );

  const [rows] = await db.execute("SELECT * FROM gallery WHERE id = ?", [
    result.insertId
  ]);

  res.status(201).json({
    success: true,
    message: "Foto galeri berhasil ditambahkan",
    data: serializeGallery(rows[0])
  });
});

export const updateGallery = asyncHandler(async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM gallery WHERE id = ? LIMIT 1", [
    req.params.id
  ]);

  if (rows.length === 0) {
    throw new AppError("Foto galeri tidak ditemukan", 404);
  }

  const existing = rows[0];
  const data = validate(updateGallerySchema, req.body);
  const image = imageUrlFromFile(req.file, "gallery");
  const fields = [];
  const values = [];

  if (data.title !== undefined) {
    fields.push("title = ?");
    values.push(data.title);
  }

  if (data.sort_order !== undefined) {
    fields.push("sort_order = ?");
    values.push(data.sort_order);
  }

  if (image) {
    fields.push("image = ?");
    values.push(image);
  }

  if (fields.length === 0) {
    return res.json({
      success: true,
      message: "Tidak ada perubahan",
      data: serializeGallery(existing)
    });
  }

  fields.push("updated_at = CURRENT_TIMESTAMP");
  values.push(req.params.id);

  await db.execute(
    `UPDATE gallery SET ${fields.join(", ")} WHERE id = ?`,
    values
  );

  if (image && existing.image) {
    await deleteImage(existing.image);
  }

  const [updated] = await db.execute("SELECT * FROM gallery WHERE id = ?", [
    req.params.id
  ]);

  res.json({
    success: true,
    message: "Foto galeri berhasil diperbarui",
    data: serializeGallery(updated[0])
  });
});

export const deleteGallery = asyncHandler(async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM gallery WHERE id = ? LIMIT 1", [
    req.params.id
  ]);

  if (rows.length === 0) {
    throw new AppError("Foto galeri tidak ditemukan", 404);
  }

  await db.execute("DELETE FROM gallery WHERE id = ?", [req.params.id]);

  if (rows[0].image) {
    await deleteImage(rows[0].image);
  }

  res.json({
    success: true,
    message: "Foto galeri berhasil dihapus"
  });
});
