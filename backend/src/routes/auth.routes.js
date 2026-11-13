import express from "express";
import rateLimit from "express-rate-limit";
import { login, logout, me } from "../controller/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Terlalu banyak percobaan login, coba lagi dalam 15 menit"
  }
});

router.post("/login", loginLimiter, login);
router.post("/logout", protect, logout);
router.get("/me", protect, me);

export default router;
