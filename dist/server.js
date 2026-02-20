import express from "express";
import cookieParser from "cookie-parser";
import { connectDB, disconnectDB } from "./config/db.js";
// Import Routes
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import watchListRoutes from "./routes/watchListRoutes.js";
// config(); // Already handled in db.js
await connectDB();
const app = express();
// body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const PORT = 5001;
app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/watchlist", watchListRoutes);
const server = app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
// Handle unhandled promise rejections (e.g db connection errors)
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});
// Handle uncaught execption
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});
// Gracefully shutdown
process.on("SIGTERM", (err) => {
    console.error("SIGTERM received, shutting down gracefully");
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});
