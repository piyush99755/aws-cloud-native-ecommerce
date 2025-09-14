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
    // Try fetching from Fakestore API
    const { data } = await axios.get('https://fakestoreapi.com/products', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
          'AppleWebKit/537.36 (KHTML, like Gecko) ' +
          'Chrome/116.0.0.0 Safari/537.36',
      },
      timeout: 10000, // 10s timeout
    });
    console.log(`Fetched ${data.length} products from Fakestore API.`);
    return data;
  } catch (err) {
    console.error('Fakestore API failed, falling back to local JSON.', err.message);

    // Fallback to local JSON file
    const localPath = path.join(__dirname, 'fakestore.json');
    if (fs.existsSync(localPath)) {
      const raw = fs.readFileSync(localPath);
      const localData = JSON.parse(raw);
      console.log(`Loaded ${localData.length} products from local fakestore.json.`);
      return localData;
    } else {
      throw new Error('No local fakestore.json file found.');
    }
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
