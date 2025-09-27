// -------------------------
// Orders
// -------------------------

// Create new order
app.post("/api/orders", async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: "Order must include items" });
    }

    // Insert order
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
        [order.id, item.id, item.quantity, item.price, item.name, item.image || null]
      );
      insertedItems.push(itemResult.rows[0]);
    }

    const fullOrder = { ...order, items: insertedItems };

    console.log(" Order created:", order.id);
    res.status(201).json({ order: fullOrder }); // <-- wrap in { order }
  } catch (err) {
    console.error(" Error saving order:", err);
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

    // Ensure items is parsed as array
    const orders = result.rows.map((row) => ({
      ...row,
      items: Array.isArray(row.items) ? row.items : JSON.parse(row.items),
    }));

    res.json(orders);
  } catch (err) {
    console.error(" Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Delete order
app.delete("/api/orders/:id", async (req, res) => {
  const orderId = parseInt(req.params.id, 10);
  if (isNaN(orderId)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }

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
    res.json({ success: true });
  } catch (err) {
    console.error(" Error deleting order:", err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});
