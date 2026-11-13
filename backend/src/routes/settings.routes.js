import express from "express";
import {
  getSettings,
  updateSettings
} from "../controller/settings.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadSettingsImage } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", getSettings);
router.put(
  "/",
  protect,
  uploadSettingsImage.fields([
    { name: "logo", maxCount: 1 },
    { name: "hero_image", maxCount: 1 }
  ]),
  updateSettings
);

export default router;
