import pg from "pg";
import dotenv from "dotenv";

dotenv.config(); // load .env

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Connected to DB:", result.rows[0]);
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

export async function query(text, params) {
  return pool.query(text, params);
}
