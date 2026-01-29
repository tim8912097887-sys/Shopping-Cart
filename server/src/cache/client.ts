import { createClient } from "redis";
import { env } from "../config/env.config.js";
import { logger } from "../utilities/logger.js";

const url = `redis://:${env.REDIS_PASSWORD}@${env.REDIS_HOST}:${env.REDIS_PORT}`;

export const redisClient = createClient({
    url
});
// Handle event
redisClient.on("connect",() => logger.info("Redis is connecting"));
redisClient.on("ready",() => logger.info("Redis connected"));
redisClient.on("end",() => logger.warn("Redis disconnected"));
redisClient.on("reconnecting",() => logger.info("Redis is reconnecting"));
redisClient.on("error",(error) => logger.error(error));

export const redisConnection = async() => {
    try {
        await redisClient.connect();
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

export const redisDisconnection = async() => {
    try {
        await redisClient.close();
    } catch (error) {
        logger.error(error);
        throw error;
    }
}