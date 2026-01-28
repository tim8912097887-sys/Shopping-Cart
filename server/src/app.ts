import express from "express";
import authRouter from "./route/auth.route.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from "./swagger.js";

export const app = express();

const specs = swaggerJSDoc(swaggerOptions);

// Documentation UI
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(specs));
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

