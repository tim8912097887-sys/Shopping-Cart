import { env } from "../../config/env.config.js";
import { ApiError, ErrorCode, ErrorType } from "../../custom/ApiError.js";
import { logger } from "../../utilities/logger.js";
import { increaseAccessCount, setCountExpire } from "../rate_limit/query.js"

const ipPrefix = `IP`;

export const loginCount = async(ip: string) => {
    const userId = `${ipPrefix}${ip}`;

    const currentCount = await increaseAccessCount(userId);
    logger.info(`User: ${userId},CurrentCount: ${currentCount+1}`);
    // Let database handle count prevent race condition
    if(currentCount === 1) {
        const isSet = await setCountExpire(userId,Number(env.LOGIN_WINDOW_FRAME));
        if(!isSet) throw new ApiError(ErrorType.SERVER_CONFLICT,ErrorCode.SERVER_CONFLICT,"Fail to set login count",true);
        return isSet;
    } 
    const maxTimes = Number(env.LOGIN_WINDOW_TIMES);
    if(currentCount>=maxTimes) {
        throw new ApiError(ErrorType.TOO_MANY_REQUEST,ErrorCode.TOO_MANY_REQUEST,"Too many request",true); 
    }
    return currentCount;
}