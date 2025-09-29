import express from "express";
import cors from "cors";
import { sendOrderConfirmation } from "./emailService.js";
import { verifyToken, requireAdmin } from "./authMiddleware.js";
import pool from "./db.js"; // make sure you have your PostgreSQL pool setup

// -------------------------
// Setup
// -------------------------
const app = express();
app.use(express.json());

// Enable CORS for your frontend
app.use(cors({
  origin: "https://app.piyushkumartadvi.link", // your frontend URL
  credentials: true, // allow cookies/headers
}));

// Optional: handle preflight requests globally
app.options("*", cors());

// -------------------------
// Orders API (Protected)
// -------------------------

// Create new order (authenticated user only)
app.post("/api/orders", verifyToken, async (req, res) => {
  try {
    const { items, total } = req.body;
    const userId = req.user.sub;
    const userEmail = req.user.email;

    if (!items || !items.length) {
      return res.status(400).json({ error: "Order must include items" });
    }

    const orderResult = await pool.query(
      "INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *",
      [userId, total]
    );
    const order = orderResult.rows[0];

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

    // Send confirmation email
    if (userEmail) {
      await sendOrderConfirmation(userEmail, fullOrder);
    }

    console.log("Order created:", order.id);
    res.status(201).json({ order: fullOrder });

  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ error: "Failed to save order" });
  }
});

// Get orders for the logged-in user
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

    const orders = result.rows.map(row => ({
      ...row,
      items: Array.isArray(row.items) ? row.items : JSON.parse(row.items),
    }));

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Delete an order (only if it belongs to logged-in user)
app.delete("/api/orders/:id", verifyToken, async (req, res) => {
  const orderId = parseInt(req.params.id, 10);
  const userId = req.user.sub;

  if (isNaN(orderId)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }

  try {
    const orderCheck = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
      [orderId, userId]
    );

    if (orderCheck.rowCount === 0) {
      return res.status(403).json({ error: "Not authorized to delete this order" });
    }

    await pool.query("DELETE FROM order_items WHERE order_id = $1", [orderId]);
    await pool.query("DELETE FROM orders WHERE id = $1", [orderId]);

    console.log("Order deleted:", orderId);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// Admin-only: Get all orders
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

    const orders = result.rows.map(row => ({
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
// Start server
// -------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;
