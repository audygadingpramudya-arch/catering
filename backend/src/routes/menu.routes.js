import express from "express";
import {
  createMenu,
  deleteMenu,
  getMenu,
  getMenus,
  updateMenu
} from "../controller/menu.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadMenuImage } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", getMenus);
router.get("/:id", getMenu);
router.post("/", protect, uploadMenuImage.single("image"), createMenu);
router.put("/:id", protect, uploadMenuImage.single("image"), updateMenu);
router.delete("/:id", protect, deleteMenu);

export default router;
