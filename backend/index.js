import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/connectDB.js";
import errorHandler from "./middleware/errorHandler.js";
import taskRoutes from "./routes/taskRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://task-manager-algo-clan.vercel.app",
        ],
        credentials: false,
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the Task Manager API");
});

app.use("/api", taskRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
