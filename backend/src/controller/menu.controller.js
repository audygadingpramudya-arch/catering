import db from "../config/database.js";
import { deleteImage, imageUrlFromFile } from "../services/image.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { createMenuSchema, updateMenuSchema, validate } from "../validators/index.js";

function serializeMenu(item) {
  return {
    ...item,
    price: Number(item.price),
    popular: Boolean(item.popular),
    is_active: Boolean(item.is_active)
  };
}

export const getMenus = asyncHandler(async (req, res) => {
  const showAll = req.query.all === "1";
  const query = showAll
    ? "SELECT * FROM menus ORDER BY popular DESC, created_at DESC"
    : "SELECT * FROM menus WHERE is_active = 1 ORDER BY popular DESC, created_at DESC";

  const [menus] = await db.execute(query);

  res.json({
    success: true,
    data: menus.map(serializeMenu)
  });
});

export const getMenu = asyncHandler(async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM menus WHERE id = ? LIMIT 1", [
    req.params.id
  ]);

  if (rows.length === 0) {
    throw new AppError("Menu tidak ditemukan", 404);
  }

  res.json({
    success: true,
    data: serializeMenu(rows[0])
  });
});

export const createMenu = asyncHandler(async (req, res) => {
  const data = validate(createMenuSchema, req.body);
  const image = imageUrlFromFile(req.file, "menus");

  const [result] = await db.execute(
    `INSERT INTO menus
      (name, category, price, description, image, popular, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.category,
      data.price,
      data.description || "",
      image,
      data.popular ? 1 : 0,
      data.is_active ? 1 : 0
    ]
  );

  const [rows] = await db.execute("SELECT * FROM menus WHERE id = ? LIMIT 1", [
    result.insertId
  ]);

  res.status(201).json({
    success: true,
    message: "Menu berhasil ditambahkan",
    data: serializeMenu(rows[0])
  });
});

export const updateMenu = asyncHandler(async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM menus WHERE id = ? LIMIT 1", [
    req.params.id
  ]);

  if (rows.length === 0) {
    throw new AppError("Menu tidak ditemukan", 404);
  }

  const existing = rows[0];
  const data = validate(updateMenuSchema, req.body);
  const image = imageUrlFromFile(req.file, "menus");
  const allowedFields = ["name", "category", "price", "description", "popular", "is_active"];
  const fields = [];
  const values = [];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      const normalizedValue =
        field === "popular" || field === "is_active"
          ? data[field] ? 1 : 0
          : data[field];

      fields.push(`${field} = ?`);
      values.push(normalizedValue);
    }
  }

  if (image) {
    fields.push("image = ?");
    values.push(image);
  }

  if (fields.length === 0) {
    return res.json({
      success: true,
      message: "Tidak ada perubahan",
      data: serializeMenu(existing)
    });
  }

  fields.push("updated_at = CURRENT_TIMESTAMP");
  values.push(req.params.id);

  await db.execute(`UPDATE menus SET ${fields.join(", ")} WHERE id = ?`, values);

  if (image && existing.image) {
    await deleteImage(existing.image);
  }

  const [updated] = await db.execute("SELECT * FROM menus WHERE id = ? LIMIT 1", [
    req.params.id
  ]);

  res.json({
    success: true,
    message: "Menu berhasil diperbarui",
    data: serializeMenu(updated[0])
  });
});

export const deleteMenu = asyncHandler(async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM menus WHERE id = ? LIMIT 1", [
    req.params.id
  ]);

  if (rows.length === 0) {
    throw new AppError("Menu tidak ditemukan", 404);
  }

  await db.execute("DELETE FROM menus WHERE id = ?", [req.params.id]);

  if (rows[0].image) {
    await deleteImage(rows[0].image);
  }

  res.json({
    success: true,
    message: "Menu berhasil dihapus"
  });
});
