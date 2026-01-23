import mongoose from "mongoose"
import { env } from "./env.config.js"
import { logger } from "../utilities/logger.js"

export const dbConnection = async() => {
    // Handle database event
    mongoose.connection.on("error",() => {
      logger.error(`Database Connection Error`);
    });
    mongoose.connection.on("connected",() => logger.info(`Database Connected`));
    mongoose.connection.on("disconnecting",() => logger.info(`Database is disconnecting`));
    mongoose.connection.on("reconnected",() => logger.info(`Database is reconnected`));
    
    try {
        await mongoose.connect(env.MONGO_URI,{
            // Fail fast to reconnect
            connectTimeoutMS: 5000,
            // Handle high traffic
            maxPoolSize: 20,
            // Prevent sudden burst of traffic
            minPoolSize: 5,
            // Speed up connection time by not search IP6
            family: 4,
            // Fail fast to reconnect
            serverSelectionTimeoutMS: 10000,
            // Prevent not connected socket be use
            maxIdleTimeMS: 60000,
            // General waiting time
            socketTimeoutMS: 45000,
            // Enhance initialize speed in production
            autoIndex: env.NODE_ENV === 'development',
            // Detect failure fast
            heartbeatFrequencyMS: 5000
        })
    } catch (error: any) {
        // Rethrow error handle by shutdown function
        logger.error(error.message);
        throw error;
    }
} 

export const dbDisconnection = async() => {
    await mongoose.connection.close();
}