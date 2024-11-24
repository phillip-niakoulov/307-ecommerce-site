const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

console.log(`PORT: ${process.env.PORT}, BACKEND_URL: ${process.env.BACKEND_URL}, DATABASE_URL: ${process.env.DATABASE_URL}, VITE_API_BACKEND_PORT: ${process.env.VITE_API_BACKEND_PORT}, VITE_API_BACKEND_URL: ${process.env.VITE_API_BACKEND_URL}`)

mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on http://localhost:5000`);
});
