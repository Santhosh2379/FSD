
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app = express();

// ================= MIDDLEWARE =================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(morgan("dev"));

// ================= ENVIRONMENT VARIABLES =================

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || "mern_crud_db";

// ================= DATABASE CONNECTION =================

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: DB_NAME,
    });

    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  }
};

// ================= POST SCHEMA AND MODEL =================

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model("Post", postSchema);

// ================= CREATE POST =================

// POST /api/v1/posts

app.post("/api/v1/posts", async (req, res) => {
  try {
    const post = new Post(req.body);

    await post.save();

    res.status(201).json({
      message: "Post created successfully",
      data: post,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// ================= READ ALL POSTS =================

// GET /api/v1/posts

app.get("/api/v1/posts", async (req, res) => {
  try {
    const posts = await Post.find();

    res.status(200).json({
      message: "Posts retrieved successfully",
      data: posts,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ================= READ POST BY ID =================

// GET /api/v1/posts/:id

app.get("/api/v1/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json({
      message: "Post retrieved successfully",
      data: post,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ================= UPDATE POST =================

// PUT /api/v1/posts/:id

app.put("/api/v1/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const post = await Post.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json({
      message: "Post updated successfully",
      data: post,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// ================= DELETE POST =================

// DELETE /api/v1/posts/:id

app.delete("/api/v1/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json({
      message: "Post deleted successfully",
      data: post,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ================= TEST ROUTE =================

// GET /

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Express Test",
  });
});

// ================= START SERVER =================

const startServer = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI environment variable is missing");
    }

    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
};

startServer();
