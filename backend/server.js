const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Load DB config from environment
const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = process.env;

// Setup Postgres connection pool
const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  port: DB_PORT || 5432,
});

// Test DB connection on startup
pool.connect()
  .then(() => console.log("Connected to Postgres"))
  .catch(err => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });

// Middleware to log requests
app.use((req, res, next) => {
  console.log("Authorization header:", req.headers.authorization);
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Products endpoint fetching from DB
app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, price FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("App is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
