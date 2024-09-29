// app/lib/db.js
import { Pool } from "pg";

// Connection pool to manage PostgreSQL connections
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function query(text, params) {
    const res = await pool.query(text, params);
    return res;
}
