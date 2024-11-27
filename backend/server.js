const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRouts = require('./routes/orderRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

console.log(`PORT: ${process.env.PORT}`);

mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRouts);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on http://localhost:5000`);
});
