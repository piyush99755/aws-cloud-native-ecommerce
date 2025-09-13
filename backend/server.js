const express = require("express");
require("dotenv").config();
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

// Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://app.piyushkumartadvi.link"
];
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

app.use(express.json());

// Postgres setup
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432
});

pool.connect()
  .then(() => console.log("Connected to Postgres"))
  .catch(err => console.error("DB connection failed:", err));

// Log all requests
app.use((req,res,next)=> { console.log(`➡️ ${req.method} ${req.path}`); next(); });

// Stripe payment routes
const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

// Health check
app.get("/health", (req,res)=>res.status(200).send("OK"));

// Products
app.get("/api/products", async (req,res)=>{
  try {
    const result = await pool.query("SELECT id, name, price FROM products");
    res.json(result.rows);
  } catch(err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error:"Failed to fetch products" });
  }
});

// Root
app.get("/", (req,res)=>res.send("App is running"));

// Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", ()=>console.log(`Server running on port ${PORT}`));
