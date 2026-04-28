require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');

const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://mongodb:27017/productdb';
const JWT_SECRET =
  process.env.JWT_SECRET || 'supersecretkey123';

/* ===============================
   MIDDLEWARE
================================*/
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ===============================
   MONGODB CONNECTION
   (DISABLED DURING TESTS)
================================*/
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) =>
      console.error('MongoDB connection error:', err)
    );
}

/* ===============================
   HEALTH CHECK (FOR TEST)
================================*/
app.get('/', (req, res) => {
  res.status(200).send('API Running');
});

/* ===============================
   PRODUCT ROUTES
================================*/
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ===============================
   AUTH ROUTES
================================*/
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        message: 'User already exists',
      });

    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET
    );

    res.status(201).json({ token, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({
        message: 'Invalid credentials',
      });

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
      return res.status(400).json({
        message: 'Invalid credentials',
      });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET
    );

    res.status(200).json({ token, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   AUTH MIDDLEWARE
================================*/
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token =
    authHeader && authHeader.split(' ')[1];

  if (!token)
    return res.status(401).json({
      message: 'Unauthorized',
    });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({
        message: 'Forbidden',
      });

    req.user = user;
    next();
  });
};

/* ===============================
   ORDER ROUTE
================================*/
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } =
      req.body;

    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress,
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ===============================
   FRONTEND FALLBACK
================================*/
app.get('*', (req, res) => {
  res.sendFile(
    path.join(__dirname, 'public', 'index.html')
  );
});

/* ===============================
   START SERVER (NOT DURING TEST)
================================*/
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () =>
    console.log(`Server running on ${PORT}`)
  );
}

module.exports = app;
