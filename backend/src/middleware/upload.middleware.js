import multer from "multer";
import path from "path";
import fs from "fs";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

function createStorage(folder) {
  const uploadDirectory = path.resolve("uploads", folder);

  fs.mkdirSync(uploadDirectory, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const safeExtension = allowedExtensions.includes(extension) ? extension : ".jpg";
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExtension}`;

      cb(null, filename);
    }
  });
}

function fileFilter(req, file, cb) {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Format foto harus JPG, PNG, atau WEBP"));
  }

  cb(null, true);
}

function createUploader(folder) {
  return multer({
    storage: createStorage(folder),
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  });
}

export const uploadMenuImage = createUploader("menus");
export const uploadGalleryImage = createUploader("gallery");
export const uploadSettingsImage = createUploader("settings");
