// import pg from "pg";
// import dotenv from "dotenv";

// dotenv.config();

// const { Pool } = pg;

// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// pool
//   .query("SELECT NOW()")
//   .then(() => console.log("✅ PostgreSQL connected successfully"))
//   .catch((err) => console.error("❌ PostgreSQL connection error:", err));
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const isProductionDatabase =
  process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost");

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProductionDatabase
    ? {
        rejectUnauthorized: false,
      }
    : false,
});

pool
  .query("SELECT NOW()")
  .then(() => console.log("✅ PostgreSQL connected successfully"))
  .catch((err) => console.error("❌ PostgreSQL connection error:", err));