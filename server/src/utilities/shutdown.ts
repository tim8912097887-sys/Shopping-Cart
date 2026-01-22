import { Server } from "http";
import { logger } from "./logger.js";

export const setupGracefulShutdown = (server: Server) => {
        // Flag prevent mutiple shutdown
        let isShutdown = false;
        const handleShutdown = async(signal: string) => {
            if(isShutdown) return;
            isShutdown = true;
            logger.info(`\n${signal} received. Starting graceful shutdown...`);
            // Shutdown timeout prevent hanging 
            const forceExitTimout = setTimeout(() => {
                logger.error("Shutdown timed out. Forcefully exiting."); 
                process.exit(1); 
            },15000)
            try {
                // Close server first (stop accepting new requests)
                await new Promise<void>((resolve, reject) => {
                    server.close((err) => (err ? reject(err) : resolve()));
                });
                logger.info("HTTP server closed.");
                clearTimeout(forceExitTimout);
                process.exit(0);
            } catch (error) {
                logger.error("Error during shutdown:", error);
                process.exit(1);
            }
    } 
    // Handle shutdown on termination
    process.on("SIGINT",handleShutdown);
    process.on("SIGTERM",handleShutdown);
    // Handle shutdown on unexpected result
    process.on("uncaughtException",handleShutdown);
    // For unhandled errors, log the error before shutting down
    process.on("unhandledRejection", (err) => {
        logger.error("Uncaught Exception:", err);
        handleShutdown("unhandledRejection");
    });
}