import express from "express";
import cors from "cors";
import "dotenv/config"; // Enables environment variables from .env file
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

connectDB();

const CLIENT_URL = "http://localhost:5173";

// Allows the server to accept requests from different origins
app.use(
  cors({
    origin: CLIENT_URL, // Only allow requests from CLIENT_URL
    credentials: true, // Allow credentials to be sent in the request
  }),
);

app.use(cookieParser()); // Makes cookies available in requests
app.use(express.json()); // Allows JSON to be parsed in requests

app.get("/", (req, res) => res.send("API Working"));

app.use("/api/auth", authRouter); // Mount authRouter routes under /api/auth
app.use("/api/user", userRouter); // Mount userRouter routes under /api/user

app.listen(port, () => console.log(`Server is running on port ${port}`));
