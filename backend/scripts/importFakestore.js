const axios= require('axios');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

async function importData() {
    try {
        const { data } = await axios.get("https://fakestoreapi.com/products");

        for(const product of data){
            await pool.query(
                `INSERT INTO PRODUCTS (id, name, price, description, category,image, rating, rating_count)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                ON CONFLICT (id) DO NOTHING`,
                [
                    product.id,
                    product.title,
                    product.price,
                    product.description,
                    product.category,
                    product.image,
                    product.rating.rate,
                    product.rating.count,
                ]
            );
            
        } 
         console.log("Fakestore products imported successfully!");

        }
    catch(err) {
        console.error(" Error importing data:", err);
    }
    finally {
        pool.end();
    }

}
importData();
    
