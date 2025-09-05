const express = require('express');
const cors = require('cors');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use((req,res,next) => {
    console.log("Authorization header:", req.headers.authorization);
    next();
});

// Products endpoint
app.get('/products', (req, res) => {
  const sampleProducts = [
    { id: 1, name: 'Product 1', price: 10 },
    { id: 2, name: 'Product 2', price: 20 },
  ];
  res.json(sampleProducts);
});


const PORT = process.env.PORT || 5000; //important for Elastic Beanstalk

app.listen(PORT, ()=>{
    console.log(`Server is running on port:${PORT}`);
});


