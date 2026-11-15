
import express from "express";
import dotenv from "dotenv";

import {
  createProduct,
  readProducts,
  readProductById,
  updateProductForm,
  updateProduct,
  deleteProduct,
  createProductForm,
} from "./controllers/productController.js";

import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 9500;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS configuration
app.set("view engine", "ejs");

// Product routes
app.get("/product-form", createProductForm);
app.post("/add-product", createProduct);

app.get("/", readProducts);
app.get("/product/:id", readProductById);

app.get("/product-form/:id", updateProductForm);
app.post("/add-product/:id", updateProduct);

app.get("/delete-product/:id", deleteProduct);

// Start server after database connection
const startServer = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI environment variable is missing");
    }

    if (!DB_NAME) {
      throw new Error("DB_NAME environment variable is missing");
    }

    await connectDB(MONGO_URI, DB_NAME);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
