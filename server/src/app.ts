import express from "express";
import authRouter from "./route/auth.route.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";

export const app = express();

// Body Parser
app.use(express.json());
app.use(cookieParser());
// Routes
app.use("/auth",authRouter);

// Global Error handler
app.use(errorHandler);
// Test route
app.get("/",(_,res) => {
     res.json({ success: true });
})

