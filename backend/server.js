const express = require("express");
require("dotenv").config();
const { Pool } = require("pg");

const app = express();

// Allowed origins: your frontend
const allowedOrigins = [
  "http://localhost:3000",
  "https://app.piyushkumartadvi.link"
];

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Respond immediately to preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

// DB setup
const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = process.env;
const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  port: DB_PORT || 5432,
});

pool.connect()
  .then(() => console.log("Connected to Postgres"))
  .catch(err => console.error("DB connection failed:", err));

// Log all requests
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/health", (req, res) => res.status(200).send("OK"));

// Products endpoint
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, price FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Root endpoint
app.get("/", (req, res) => res.send("App is running"));

// EB uses process.env.PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server is running on port: ${PORT}`));
