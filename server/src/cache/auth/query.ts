import { env } from "../../config/env.config.js";
import { ApiError, ErrorCode, ErrorType } from "../../custom/ApiError.js";
import { logger } from "../../utilities/logger.js";
import { increaseAccessAndExpire } from "../rate_limit/query.js"

const ipPrefix = `IP`;

export const loginCount = async(ip: string) => {
    const userId = `${ipPrefix}${ip}`;
    const maxTimes = Number(env.LOGIN_WINDOW_TIMES);
    const ttl = Number(env.LOGIN_WINDOW_FRAME);

    const currentCount = await increaseAccessAndExpire(userId,ttl);
    logger.info(`User: ${userId},CurrentCount: ${currentCount}`);
   
    if(currentCount>maxTimes) {
        throw new ApiError(ErrorType.TOO_MANY_REQUEST,ErrorCode.TOO_MANY_REQUEST,"Too many request",true); 
    }
    return currentCount;
}