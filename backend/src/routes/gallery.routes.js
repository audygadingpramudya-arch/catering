import express from "express";
import {
  createGallery,
  deleteGallery,
  getGallery,
  updateGallery
} from "../controller/gallery.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadGalleryImage } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", getGallery);
router.post("/", protect, uploadGalleryImage.single("image"), createGallery);
router.put("/:id", protect, uploadGalleryImage.single("image"), updateGallery);
router.delete("/:id", protect, deleteGallery);

export default router;
