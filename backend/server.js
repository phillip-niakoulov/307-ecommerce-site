const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose
    .connect("mongodb+srv://ecommerceapp:SNlCVgBoPEldIdXm@ecommercepro.vjker.mongodb.net/?retryWrites=true&w=majority&appName=EcommercePro")
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/carts', cartRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// BE INCREDIBLY CAREFUL WITH THIS
// async function clearDatabase() {
//   await mongoose.connect("mongodb://localhost:27017/ecommerce", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

// Drop the database
//   await mongoose.connection.db.dropDatabase();

//   console.log("Database cleared!");
//   await mongoose.disconnect();
// }
