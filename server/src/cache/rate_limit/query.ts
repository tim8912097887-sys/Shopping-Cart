import { redisClient } from "../client.js"

export const increaseAccessCount = async(userId: string) => {
     const currentCount = await redisClient.incr(userId);
     return currentCount;
}

export const setCountExpire = async(userId: string,expired: number) => {
     const isSet = redisClient.pExpire(userId,expired);
     return isSet;
}