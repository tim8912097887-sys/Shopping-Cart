import { loginCount } from "../cache/auth/query.js";
import { asyncHandler } from "../utilities/asyncHandler.js";

export const loginRateLimit = asyncHandler(async(req,_,next) => {
    const ip = req.ip || req.ips[0]; 
    await loginCount(ip);
    return next();
})