import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import mysql from "mysql2/promise";

const schemaPath = path.resolve("scripts/schema.sql");

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  port: Number(process.env.DB_PORT || 3306),
  multipleStatements: true
});

try {
  const schema = await fs.readFile(schemaPath, "utf8");

  await connection.query(schema);

  console.log("Database dan tabel berhasil disiapkan");
} catch (error) {
  console.error("Gagal menyiapkan database:", error.message);
  process.exitCode = 1;
} finally {
  await connection.end();
}
