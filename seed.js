const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

const seedProducts = [
    {
        name: "Quantum X Pro Laptop",
        description: "Next-generation quantum processing laptop for extreme performance. Features a 16-inch OLED display, 64GB RAM, and 2TB NVMe SSD.",
        price: 2499.99,
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop",
        category: "Electronics"
    },
    {
        name: "Aura Noise-Cancelling Headphones",
        description: "Immersive audio experience with industry-leading active noise cancellation. 40-hour battery life and premium comfort.",
        price: 349.00,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
        category: "Audio"
    },
    {
        name: "Nebula Smartwatch Series 7",
        description: "Advanced health tracking, seamless connectivity, and a stunning edge-to-edge display. Water resistant up to 50 meters.",
        price: 399.50,
        imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop",
        category: "Wearables"
    },
    {
        name: "Zenith Mechanical Keyboard",
        description: "Customizable RGB mechanical keyboard with tactile switches for satisfying typing and ultimate gaming performance.",
        price: 159.99,
        imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2071&auto=format&fit=crop",
        category: "Accessories"
    }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
      console.log('Connected to MongoDB. Seeding database...');
      await Product.deleteMany({}); // Clear existing products
      await Product.insertMany(seedProducts);
      console.log('Database seeded successfully!');
      mongoose.connection.close();
  })
  .catch(err => {
      console.error('Seeding failed:', err);
      mongoose.connection.close();
  });
