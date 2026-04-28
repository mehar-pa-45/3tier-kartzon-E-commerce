const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(cors());
app.use(express.json());

/* ======================
   ROUTES
====================== */
app.get("/", (req, res) => {
  res.status(200).json({ message: "API Running" });
});

app.get("/api/products", (req, res) => {
  res.status(200).json([
    { name: "Laptop", price: 50000 },
    { name: "Mouse", price: 1000 }
  ]);
});

/* ======================
   DB CONNECTION
====================== */

const connectDB = async () => {
  if (process.env.NODE_ENV === "test") {
    console.log("Test mode → DB not connected");
    return;
  }

  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce"
    );
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

/* ======================
   START SERVER
====================== */

let server;

if (process.env.NODE_ENV !== "test") {
  connectDB();

  const PORT = process.env.PORT || 5000;

  server = app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}

/* ======================
   EXPORT FOR TESTING
====================== */

module.exports = app;
