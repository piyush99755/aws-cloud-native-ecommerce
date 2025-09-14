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

async function fetchProducts() {
  try {
    // Read local JSON file
    const localPath = path.join(__dirname, 'fakestore.json');
    if (fs.existsSync(localPath)) {
      const raw = fs.readFileSync(localPath, 'utf-8');
      const products = JSON.parse(raw);
      console.log(`Loaded ${products.length} products from local fakestore.json.`);
      return products;
    } else {
      throw new Error('fakestore.json file not found.');
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
         ON CONFLICT (id) DO NOTHING`,
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
