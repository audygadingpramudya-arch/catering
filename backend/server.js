import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "path";
import fs from "fs";
import apiRoutes from "./src/routes/index.js";
import db from "./src/config/database.js";
import {
  errorHandler,
  notFound
} from "./src/middleware/error.middleware.js";

const app = express();
const port = Number(process.env.PORT || 5000);

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:4321")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin tidak diizinkan oleh CORS"));
    },
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const uploadsDirectory = path.resolve("uploads");
fs.mkdirSync(uploadsDirectory, { recursive: true });
app.use("/uploads", express.static(uploadsDirectory, { maxAge: "7d" }));

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET belum diatur. Login tidak akan berfungsi dengan aman.");
}

const server = app.listen(port, () => {
  console.log(`API berjalan di http://localhost:${port}`);
});

db.query("SELECT 1")
  .then(() => {
    console.log("Koneksi database berhasil");
  })
  .catch((error) => {
    console.error("Koneksi database gagal:", error.message);
  });

function shutdown(signal) {
  console.log(`${signal} diterima, menutup server...`);
  server.close(() => {
    db.end()
      .catch(() => {})
      .finally(() => process.exit(0));
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
