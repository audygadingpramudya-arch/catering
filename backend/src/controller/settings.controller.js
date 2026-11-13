import db from "../config/database.js";
import { deleteImage, imageUrlFromFile } from "../services/image.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateSettingsSchema, validate } from "../validators/index.js";

const defaultSettings = {
  business_name: "Ar Rahman Catering",
  tagline: "Catering Halal Terpercaya",
  hero_title: "Lezat & Praktis untuk Setiap Acara Anda",
  hero_description:
    "Ar Rahman Catering menyediakan nasi box, prasmanan, dan menu syukuran dengan cita rasa rumahan, harga terjangkau, dan pengiriman tepat waktu.",
  about_title: "Catering Pilihan Keluarga Indonesia",
  about_description:
    "Lebih dari 10 tahun melayani kebutuhan catering harian, acara kantor, hingga perayaan besar.",
  whatsapp: "6282142128202",
  instagram: "",
  facebook: "",
  address: "Kota dan Kabupaten sekitarnya",
  opening_hours: "Setiap Hari, 07.00 - 20.00 WIB",
  maps_url: "",
  logo: null,
  hero_image: null
};

async function ensureSettings() {
  const [rows] = await db.execute("SELECT * FROM site_settings WHERE id = 1 LIMIT 1");

  if (rows.length > 0) {
    return rows[0];
  }

  await db.execute(
    `INSERT INTO site_settings
      (id, business_name, tagline, hero_title, hero_description, about_title,
       about_description, whatsapp, instagram, facebook, address, opening_hours,
       maps_url, logo, hero_image)
     VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      defaultSettings.business_name,
      defaultSettings.tagline,
      defaultSettings.hero_title,
      defaultSettings.hero_description,
      defaultSettings.about_title,
      defaultSettings.about_description,
      defaultSettings.whatsapp,
      defaultSettings.instagram,
      defaultSettings.facebook,
      defaultSettings.address,
      defaultSettings.opening_hours,
      defaultSettings.maps_url,
      defaultSettings.logo,
      defaultSettings.hero_image
    ]
  );

  const [created] = await db.execute(
    "SELECT * FROM site_settings WHERE id = 1 LIMIT 1"
  );

  return created[0];
}

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await ensureSettings();

  res.json({
    success: true,
    data: settings
  });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const existing = await ensureSettings();
  const data = validate(updateSettingsSchema, req.body);
  const logo = imageUrlFromFile(req.files?.logo?.[0], "settings");
  const heroImage = imageUrlFromFile(req.files?.hero_image?.[0], "settings");

  const allowedFields = [
    "business_name",
    "tagline",
    "hero_title",
    "hero_description",
    "about_title",
    "about_description",
    "whatsapp",
    "instagram",
    "facebook",
    "address",
    "opening_hours",
    "maps_url"
  ];

  const fields = [];
  const values = [];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(data[field]);
    }
  }

  if (logo) {
    fields.push("logo = ?");
    values.push(logo);
  }

  if (heroImage) {
    fields.push("hero_image = ?");
    values.push(heroImage);
  }

  if (fields.length === 0) {
    return res.json({
      success: true,
      message: "Tidak ada perubahan",
      data: existing
    });
  }

  fields.push("updated_at = CURRENT_TIMESTAMP");

  await db.execute(
    `UPDATE site_settings SET ${fields.join(", ")} WHERE id = 1`,
    values
  );

  if (logo && existing.logo) {
    await deleteImage(existing.logo);
  }

  if (heroImage && existing.hero_image) {
    await deleteImage(existing.hero_image);
  }

  const [updated] = await db.execute(
    "SELECT * FROM site_settings WHERE id = 1 LIMIT 1"
  );

  res.json({
    success: true,
    message: "Pengaturan website berhasil disimpan",
    data: updated[0]
  });
});
