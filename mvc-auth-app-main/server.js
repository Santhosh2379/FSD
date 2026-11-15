
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import todoRoutes from "./routes/todoRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 9000;
const mongoURI = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

// ==============================
// MIDDLEWARE
// ==============================

app.use(express.json());

// ==============================
// ROUTES
// ==============================

// Todo API
app.use("/api/v1/todos", todoRoutes);

// User API
app.use("/api/v1/users", userRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// ==============================
// CONNECT DATABASE AND START SERVER
// ==============================

const startServer = async () => {
    try {
        if (!mongoURI) {
            throw new Error("MONGO_URI environment variable is missing");
        }

        if (!dbName) {
            throw new Error("DB_NAME environment variable is missing");
        }

        await connectDB(mongoURI, dbName);

        console.log("MongoDB connected successfully");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
};

startServer();
