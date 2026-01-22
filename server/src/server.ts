import { app } from "./app.js";
import { logger } from "./utilities/logger.js";
import { setupGracefulShutdown } from "./utilities/shutdown.js";

const server = app.listen(3000,() => logger.info(`Server is running on port 3000`));

// Initialize shutdown manager
setupGracefulShutdown(server);