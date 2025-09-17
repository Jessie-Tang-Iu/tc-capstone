import pg from "pg";
import dotenv from "dotenv";

dotenv.config(); // load .env

const { Pool } = pg; // Creates a Empty Pool using PostgreSQL to manage multiple connections

// Creates the connection pool using the connection string from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Queries the database for the current time to test connection
export async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Connected to DB:", result.rows[0]);
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

// Query used for all database opeations, takes a text query (ex. SELECT * FROM users), and an array of parameters to prevent SQL injection
export async function query(text, params) {
  return pool.query(text, params);
}
