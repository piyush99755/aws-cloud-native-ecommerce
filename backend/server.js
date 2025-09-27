const express = require("express");
require("dotenv").config();
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");

const app = express();

// Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://app.piyushkumartadvi.link",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow REST clients
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Postgres setup
const pool = new Pool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "ecommerce_user",
  password: process.env.DB_PASS || "Born@1992",
  database: process.env.DB_NAME || "ecommerce",
  port: process.env.DB_PORT || 5432,
});
pool
  .connect()
  .then(() => console.log(" Connected to Postgres"))
  .catch((err) => console.error(" DB connection failed:", err));

// Log all requests
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/health", (req, res) => res.status(200).send("OK"));

// -------------------------
// Products
// -------------------------
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, price, image FROM products"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(" Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// -------------------------
// Orders
// -------------------------

// Create new order
app.post("/api/orders", async (req, res) => {
  try {
    const { items, total } = req.body;

    // Insert into orders
    const orderResult = await pool.query(
      "INSERT INTO orders (total) VALUES ($1) RETURNING *",
      [total]
    );
    const order = orderResult.rows[0];

    // Insert order items
    const insertedItems = [];
    for (const item of items) {
      const itemResult = await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, name, image)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [order.id, item.id, item.quantity, item.price, item.name, item.image]
      );
      insertedItems.push(itemResult.rows[0]);
    }

    const fullOrder = { ...order, items: insertedItems };
    console.log("✅ Order created:", order.id);
    res.json(fullOrder);
  } catch (err) {
    console.error("❌ Error saving order:", err);
    res.status(500).json({ error: "Failed to save order" });
  }
});

// Get all orders with items
app.get("/api/orders", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.id, o.total, o.created_at,
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', oi.id,
                    'product_id', oi.product_id,
                    'quantity', oi.quantity,
                    'price', oi.price,
                    'name', oi.name,
                    'image', oi.image
                  )
                ) FILTER (WHERE oi.id IS NOT NULL), '[]'
              ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       GROUP BY o.id
       ORDER BY o.id DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(" Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Delete order
app.delete("/api/orders/:id", async (req, res) => {
  const orderId = parseInt(req.params.id, 10);
  if (isNaN(orderId))
    return res.status(400).json({ error: "Invalid order ID" });

  try {
    await pool.query("DELETE FROM order_items WHERE order_id = $1", [orderId]);
    const result = await pool.query(
      "DELETE FROM orders WHERE id = $1 RETURNING *",
      [orderId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    console.log(" Order deleted:", orderId);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(" Error deleting order:", err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// -------------------------
// Frontend in production
// -------------------------
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../frontend/build");
  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(` Server running on port ${PORT}`)
);
