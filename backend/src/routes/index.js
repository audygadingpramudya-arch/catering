import express from "express";
import authRoutes from "./auth.routes.js";
import menuRoutes from "./menu.routes.js";
import testimonialRoutes from "./testimonial.routes.js";
import galleryRoutes from "./gallery.routes.js";
import settingsRoutes from "./settings.routes.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API berjalan",
    time: new Date().toISOString()
  });
});

router.use("/auth", authRoutes);
router.use("/menus", menuRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/gallery", galleryRoutes);
router.use("/settings", settingsRoutes);

export default router;
