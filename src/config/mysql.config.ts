// @ts-ignore
import mysql from "mysql";
import dotenv from "dotenv";
import * as fs from "fs";


dotenv.config({ path: `.env.${process.env.NODE_ENV}` });



const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  ssl: {
    sslmode: "verify-full",
    ca: fs.readFileSync(process.env.DB_ROOT_CERT), // e.g., '/path/to/my/server-ca.pem'
    key: fs.readFileSync(process.env.DB_KEY), // e.g. '/path/to/my/client-key.pem'
    cert: fs.readFileSync(process.env.DB_CERT), // e.g. '/path/to/my/client-cert.pem'
  },
});

export default pool;
