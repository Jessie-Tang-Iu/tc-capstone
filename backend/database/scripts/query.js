import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const res = await pool.query("SELECT * FROM workshop LIMIT 5;");
  console.table(res.rows); // Pretty prints rows
  await pool.end();
}

main().catch(console.error);

//node scripts/query.js
