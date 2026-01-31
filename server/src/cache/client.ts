import { createClient } from "redis";
import { env } from "../config/env.config.js";
import { logger } from "../utilities/logger.js";
import { ApiError, ErrorCode, ErrorType } from "../custom/ApiError.js";

const url = `redis://:${env.REDIS_PASSWORD}@${env.REDIS_HOST}:${env.REDIS_PORT}`;

export const redisClient = createClient({
    url,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 5) {
                return new ApiError(ErrorType.SERVER_ERROR,ErrorCode.SERVER_ERROR,"Redis connection failed after 5 attempts",true);
            }
            return 500;
        }
    }
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