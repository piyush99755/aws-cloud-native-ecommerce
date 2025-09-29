import express from "express";
import cors from "cors";
import pkg from "pg";
import Stripe from "stripe";
import dotenv from "dotenv";
import { sendOrderConfirmation } from "./scripts/emailService.js";
import { verifyToken, requireAdmin } from "./scripts/authMiddleware.js";

dotenv.config();
const { Pool } = pkg;

// -------------------------
// PostgreSQL Pool Setup
// -------------------------
const pool = new Pool({
  host: process.env.DB_HOST || "172.31.23.209",
  user: process.env.DB_USER || "ecommerce_user",
  password: process.env.DB_PASS || "Born@1992",
  database: process.env.DB_NAME || "ecommerce",
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) console.error("Error connecting to Postgres:", err.stack);
  else {
    console.log("Postgres connected successfully!");
    release();
  }
});

// -------------------------
// Stripe Setup
// -------------------------
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// -------------------------
// Express Setup
// -------------------------
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "https://app.piyushkumartadvi.link",
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

//health check for EB
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// -------------------------
// Products Endpoint
// -------------------------
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// -------------------------
// Payment Intent Endpoint (just create intent)
// -------------------------
app.post("/api/payment/create-payment-intent", verifyToken, async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ error: "Amount and currency required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { userId: req.user.sub },
    });

    console.log("PaymentIntent created:", paymentIntent.id);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Error creating payment intent:", err);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

// -------------------------
// Orders Endpoint (create after payment)
// -------------------------
app.post("/api/orders", verifyToken, async (req, res) => {
  try {
    const { items, total, paymentIntentId } = req.body;
    const userId = req.user.sub;
    const userEmail = req.user.email;

    if (!items || !items.length || !total || !paymentIntentId) {
      return res.status(400).json({ error: "Order must include items, total, and paymentIntentId" });
    }

    // 1. Verify payment succeeded
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    // 2. Insert order
    const orderResult = await pool.query(
      "INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *",
      [userId, total]
    );
    const order = orderResult.rows[0];

    // 3. Insert order items
    const insertedItems = [];
    for (const item of items) {
      const itemResult = await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, name, image)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [order.id, item.id, item.quantity, item.price, item.name, item.image || null]
      );
      insertedItems.push(itemResult.rows[0]);
    }

    const fullOrder = { ...order, items: insertedItems };

    // 4. Send confirmation email
    let emailStatus = null;
    if (userEmail) {
      try {
        emailStatus = await sendOrderConfirmation(userEmail, fullOrder);
      } catch (err) {
        console.error("Email sending failed:", err.message);
        emailStatus = { success: false, error: err.message };
      }
    }

    console.log("Order created:", order.id);
    res.status(201).json({ order: fullOrder, emailStatus });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// -------------------------
// Get orders for logged-in user
// -------------------------
app.get("/api/orders", verifyToken, async (req, res) => {
  try {
    const userId = req.user.sub;

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
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.id DESC`,
      [userId]
    );

    const orders = result.rows.map((row) => ({
      ...row,
      items: Array.isArray(row.items) ? row.items : JSON.parse(row.items),
    }));

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// -------------------------
// Delete order
// -------------------------
app.delete("/api/orders/:id", verifyToken, async (req, res) => {
  const orderId = parseInt(req.params.id, 10);
  const userId = req.user.sub;

  if (isNaN(orderId)) return res.status(400).json({ error: "Invalid order ID" });

  try {
    const orderCheck = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
      [orderId, userId]
    );

    if (orderCheck.rowCount === 0)
      return res.status(403).json({ error: "Not authorized to delete this order" });

    await pool.query("DELETE FROM order_items WHERE order_id = $1", [orderId]);
    await pool.query("DELETE FROM orders WHERE id = $1", [orderId]);

    console.log("Order deleted:", orderId);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// -------------------------
// Admin: Get all orders
// -------------------------
app.get("/api/admin/orders", verifyToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.id, o.total, o.created_at, o.user_id,
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

    const orders = result.rows.map((row) => ({
      ...row,
      items: Array.isArray(row.items) ? row.items : JSON.parse(row.items),
    }));

    res.json(orders);
  } catch (err) {
    console.error("Error fetching all orders (admin):", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// -------------------------
// Start Server
// -------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;

