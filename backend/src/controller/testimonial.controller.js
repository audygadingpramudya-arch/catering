import db from "../config/database.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import {
  createTestimonialSchema,
  updateTestimonialSchema,
  validate
} from "../validators/index.js";

function serializeTestimonial(testimonial) {
  return {
    ...testimonial,
    rating: Number(testimonial.rating),
    is_active: Boolean(testimonial.is_active)
  };
}

export const getTestimonials = asyncHandler(async (req, res) => {
  const showAll = req.query.all === "1";
  const query = showAll
    ? "SELECT * FROM testimonials ORDER BY created_at DESC"
    : "SELECT * FROM testimonials WHERE is_active = 1 ORDER BY created_at DESC";

  const [testimonials] = await db.execute(query);

  res.json({
    success: true,
    data: testimonials.map(serializeTestimonial)
  });
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const data = validate(createTestimonialSchema, req.body);

  const [result] = await db.execute(
    `INSERT INTO testimonials
      (name, role, message, rating, is_active)
     VALUES (?, ?, ?, ?, ?)`,
    [
      data.name,
      data.role,
      data.message,
      data.rating,
      data.is_active ? 1 : 0
    ]
  );

  const [rows] = await db.execute(
    "SELECT * FROM testimonials WHERE id = ?",
    [result.insertId]
  );

  res.status(201).json({
    success: true,
    message: "Testimoni berhasil ditambahkan",
    data: serializeTestimonial(rows[0])
  });
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const [rows] = await db.execute(
    "SELECT * FROM testimonials WHERE id = ? LIMIT 1",
    [req.params.id]
  );

  if (rows.length === 0) {
    throw new AppError("Testimoni tidak ditemukan", 404);
  }

  const data = validate(updateTestimonialSchema, req.body);
  const allowedFields = ["name", "role", "message", "rating", "is_active"];
  const fields = [];
  const values = [];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(
        field === "is_active" ? (data[field] ? 1 : 0) : data[field]
      );
    }
  }

  if (fields.length === 0) {
    return res.json({
      success: true,
      message: "Tidak ada perubahan",
      data: serializeTestimonial(rows[0])
    });
  }

  fields.push("updated_at = CURRENT_TIMESTAMP");
  values.push(req.params.id);

  await db.execute(
    `UPDATE testimonials SET ${fields.join(", ")} WHERE id = ?`,
    values
  );

  const [updated] = await db.execute(
    "SELECT * FROM testimonials WHERE id = ?",
    [req.params.id]
  );

  res.json({
    success: true,
    message: "Testimoni berhasil diperbarui",
    data: serializeTestimonial(updated[0])
  });
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const [result] = await db.execute(
    "DELETE FROM testimonials WHERE id = ?",
    [req.params.id]
  );

  if (result.affectedRows === 0) {
    throw new AppError("Testimoni tidak ditemukan", 404);
  }

  res.json({
    success: true,
    message: "Testimoni berhasil dihapus"
  });
});
