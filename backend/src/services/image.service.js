import fs from "fs/promises";
import path from "path";

const uploadRoot = path.resolve("uploads");

export async function deleteImage(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") {
    return;
  }

  if (!imageUrl.startsWith("/uploads/")) {
    return;
  }

  const relativePath = imageUrl.replace(/^\/uploads\//, "");
  const filePath = path.resolve(uploadRoot, relativePath);

  if (!filePath.startsWith(uploadRoot + path.sep)) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

export function imageUrlFromFile(file, folder) {
  if (!file) {
    return null;
  }

  return `/uploads/${folder}/${file.filename}`;
}
