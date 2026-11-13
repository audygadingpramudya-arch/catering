import { AppError } from "../utils/AppError.js";

export function notFound(req, res, next) {
  next(new AppError(`Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`, 404));
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.name === "MulterError") {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Ukuran gambar maksimal 5MB"
        : "Gagal mengunggah gambar";

    return res.status(400).json({
      success: false,
      message
    });
  }

  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || "Terjadi kesalahan server"
  });
}
