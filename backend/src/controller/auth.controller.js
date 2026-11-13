import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/database.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/"
};

function hidePassword(admin) {
  return {
    id: admin.id,
    username: admin.username,
    created_at: admin.created_at
  };
}

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    throw new AppError("Username dan password wajib diisi", 400);
  }

  const [admins] = await db.execute(
    "SELECT * FROM admins WHERE username = ? LIMIT 1",
    [username]
  );

  if (admins.length === 0) {
    throw new AppError("Username atau password salah", 401);
  }

  const admin = admins[0];
  const validPassword = await bcrypt.compare(password, admin.password);

  if (!validPassword) {
    throw new AppError("Username atau password salah", 401);
  }

  const token = jwt.sign(
    {
      id: admin.id,
      username: admin.username
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "8h"
    }
  );

  res.cookie("admin_token", token, {
    ...cookieOptions,
    maxAge: 8 * 60 * 60 * 1000
  });

  res.json({
    success: true,
    message: "Login berhasil",
    admin: hidePassword(admin)
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("admin_token", cookieOptions);

  res.json({
    success: true,
    message: "Logout berhasil"
  });
});

export const me = asyncHandler(async (req, res) => {
  const [admins] = await db.execute(
    "SELECT id, username, created_at FROM admins WHERE id = ? LIMIT 1",
    [req.admin.id]
  );

  if (admins.length === 0) {
    throw new AppError("Akun admin tidak ditemukan", 401);
  }

  res.json({
    success: true,
    admin: admins[0]
  });
});
