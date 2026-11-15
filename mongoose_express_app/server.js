
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI;

// ==============================
// MIDDLEWARE
// ==============================

app.use(express.json());

// ==============================
// MONGODB ATLAS CONNECTION
// ==============================

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is missing");
}

// ==============================
// SCHEMA AND MODEL CREATION
// ==============================

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    director: String,
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    }
});

const Movie = mongoose.model("movie", movieSchema);

// ==============================
// CREATE MOVIE
// POST /api/v1/movies
// ==============================

app.post("/api/v1/movies", (req, res, next) => {

    const newMovie = new Movie(req.body);

    newMovie.save()
        .then((result) => {
            res.status(201).json({
                message: "Movie created successfully",
                data: result
            });
        })
        .catch(next);

});

// ==============================
// GET ALL MOVIES / FILTER BY CATEGORY
// GET /api/v1/movies
// ==============================

app.get("/api/v1/movies", (req, res, next) => {

    const { category } = req.query;

    const filter = category ? { category } : {};

    Movie.find(filter)
        .then((result) => {
            res.status(200).json({
                message: "Movies retrieved successfully",
                data: result
            });
        })
        .catch(next);

});

// ==============================
// GET MOVIE BY ID
// GET /api/v1/movies/:id
// ==============================

app.get("/api/v1/movies/:id", (req, res, next) => {

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: "Invalid movie ID"
        });
    }

    Movie.findById(id)
        .then((result) => {

            if (!result) {
                return res.status(404).json({
                    message: "Movie not found"
                });
            }

            res.status(200).json({
                message: "Movie retrieved successfully",
                data: result
            });

        })
        .catch(next);

});

// ==============================
// UPDATE MOVIE BY ID
// PUT /api/v1/movies/:id
// ==============================

app.put("/api/v1/movies/:id", (req, res, next) => {

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: "Invalid movie ID"
        });
    }

    const updateData = req.body;

    Movie.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    )
        .then((result) => {

            if (!result) {
                return res.status(404).json({
                    message: "Movie not found"
                });
            }

            res.status(200).json({
                message: "Movie updated successfully",
                data: result
            });

        })
        .catch(next);

});

// ==============================
// DELETE MOVIE BY ID
// DELETE /api/v1/movies/:id
// ==============================

app.delete("/api/v1/movies/:id", (req, res, next) => {

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: "Invalid movie ID"
        });
    }

    Movie.findByIdAndDelete(id)
        .then((result) => {

            if (!result) {
                return res.status(404).json({
                    message: "Movie not found"
                });
            }

            res.status(200).json({
                message: "Movie deleted successfully",
                data: result
            });

        })
        .catch(next);

});

// ==============================
// 404 NOT FOUND MIDDLEWARE
// ==============================

app.use((req, res) => {
    res.status(404).json({
        message: "Not Found"
    });
});

// ==============================
// ERROR HANDLING MIDDLEWARE
// ==============================

app.use((err, req, res, next) => {

    console.error("ERROR:", err);

    if (err.name === "ValidationError") {
        return res.status(400).json({
            message: "Validation failed",
            error: err.message
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid data format",
            error: err.message
        });
    }

    res.status(err.status || 500).json({
        message: err.status ? err.message : "Internal server error"
    });

});

// ==============================
// CONNECT TO MONGODB AND START SERVER
// ==============================

mongoose.connect(MONGODB_URI, {
    dbName: process.env.DB_NAME || "mongoose_db"
})
    .then(() => {

        console.log("Connected to MongoDB Atlas successfully");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running on port ${PORT}`);
        });

    })
    .catch((err) => {

        console.error("MongoDB connection failed:", err);

        process.exit(1);

    });
