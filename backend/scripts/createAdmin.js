import "dotenv/config";
import bcrypt from "bcryptjs";
import db from "../src/config/database.js";

const username = process.env.ADMIN_USERNAME || "admin";
const password = process.env.ADMIN_PASSWORD || "admin123";

if (password.length < 6) {
  console.error("ADMIN_PASSWORD minimal 6 karakter");
  process.exit(1);
}

try {
  const hash = await bcrypt.hash(password, 12);

  const [existing] = await db.execute(
    "SELECT id FROM admins WHERE username = ? LIMIT 1",
    [username]
  );

  if (existing.length > 0) {
    await db.execute("UPDATE admins SET password = ? WHERE id = ?", [
      hash,
      existing[0].id
    ]);

    console.log(`Password admin "${username}" berhasil diperbarui`);
  } else {
    await db.execute(
      "INSERT INTO admins (username, password) VALUES (?, ?)",
      [username, hash]
    );

    console.log(`Admin "${username}" berhasil dibuat`);
  }
} catch (error) {
  console.error("Gagal membuat admin:", error.message);
  process.exitCode = 1;
} finally {
  await db.end();
}
