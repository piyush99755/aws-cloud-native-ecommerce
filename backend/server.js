const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");

const app = express();

// Allowed origins: your frontend
const allowedOrigins = [
  "http://localhost:3000",
  "https://d1vf5juqitmm06.cloudfront.net"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'], // do not include Authorization for now
  credentials: true,
}));

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
