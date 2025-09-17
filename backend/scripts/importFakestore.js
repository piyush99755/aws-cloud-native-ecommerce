// backend/scripts/importFakestore.js
const axios = require('axios');
const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');



// Initialize Postgres connection
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const localPath = path.join(__dirname, 'fakestore.json');

async function fetchProducts() {
  try {
    // Read local JSON file
    
    if (fs.existsSync(localPath)) {
      const raw = fs.readFileSync(localPath, 'utf-8');
      const products = JSON.parse(raw);
      console.log(`Loaded ${products.length} products from local fakestore.json.`);
      return products;
    } else {
      // Fetch from API if no local cache
      console.log("Fetching products from Fakestore API...");
      const response = await axios.get('https://fakestoreapi.com/products');
      const products = response.data;

      // Save locally for reuse
      fs.writeFileSync(localPath, JSON.stringify(products, null, 2));
      console.log(`Fetched and saved ${products.length} products from Fakestore API.`);
      return products;
    }
  } catch (err) {
    console.error('Error loading products from JSON:', err.message);
    throw err;
  }
}

async function importData() {
  try {
    const products = await fetchProducts();

    for (const product of products) {
      await pool.query(
        `INSERT INTO products (id, name, price, description, category, image)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
            price = EXCLUDED.price,
            description = EXCLUDED.description,
            category = EXCLUDED.category,
            image = EXCLUDED.image;`,
        [
          product.id,
          product.title,
          product.price,
          product.description,
          product.category,
          product.image,
        ]
      );
    }

    console.log('Products imported successfully!');
  } catch (err) {
    console.error('Error importing data:', err);
  } finally {
    await pool.end();
  }
}

importData();
