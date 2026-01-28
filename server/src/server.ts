import { app } from "./app.js";
import { redisConnection } from "./cache/client.js";
import { dbConnection } from "./config/db.config.js";
import { logger } from "./utilities/logger.js";
import { setupGracefulShutdown } from "./utilities/shutdown.js";

(async() => {
   try {
       // Connect to database before listen to server   
       await dbConnection();
       await redisConnection();
       const server = app.listen(3000,() => logger.info(`Server is running on port 3000`));

        // Initialize shutdown manager
        setupGracefulShutdown(server);
   } catch (error) {
       // Handle initial db connection error
       logger.error("Failed to start application due to DB error");
       process.exit(1);
   }
})()
