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
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow REST clients 
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

app.use(express.json());

// Postgres setup
const pool = new Pool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "ecommerce_user",
  password: process.env.DB_PASS || "Born@1992",
  database: process.env.DB_NAME || "ecommerce",
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
    const result = await pool.query("SELECT id, name, price, image FROM products");
    res.json(result.rows);
  } catch(err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error:"Failed to fetch products" });
  }
});

//orders routes
app.post("/api/orders", async (req, res) => {
  try {
    const {items, total} = req.body;

    //insert order into orders table... 
    const result = await pool.query(
      "INSERT INTO orders (total) VALUES ($1) RETURNING (id)",
      [total] 
    );
    const orderId = result.rows[0].id;

    //insert order items into orders_items table...
    for (const item of items){
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, name, image)
        VALUES($1, $2, $3, $4, $5, $6)`,
        [orderId, item.id, item.quantity, item.price, item.name, item.image]
      );
    }

    res.json({message:"Order places successfully", orderId});
}
  catch(err) {
    console.error("Error saving order", err);
    res.status(500).json({error: "failed to save order"});
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const ordersResult = await pool.query(
      "SELECT * FROM orders ORDER BY id DESC"
    );
    const orders = [];

    for (const order of ordersResult.rows) {
      const itemsResult = await pool.query(
        "SELECT * FROM order_items WHERE order_id = $1",
        [order.id]
      );
      orders.push({
        ...order,
        items: itemsResult.rows,
      });
    }

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});


// Root
app.get("/", (req,res)=>res.send("App is running"));

// Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", ()=>console.log(`Server running on port ${PORT}`));
