import { redisClient } from "../client.js"

export const increaseAccessAndExpire = async (userId: string, ttlMs: number) => {
    // 1. Increment the key
    // 2. If the new value is 1, set the expiration
    // 3. Return the new value
    const luaScript = `
        local current = redis.call('INCR', KEYS[1])
        if current == 1 then
            redis.call('PEXPIRE', KEYS[1], ARGV[1])
        end
        return current
    `;

    return await redisClient.eval(luaScript,{
       keys: [userId],
       arguments: [ttlMs.toString()]
    }) as number;
};