import jwt from "jsonwebtoken"
import { ApiError, ErrorCode, ErrorType } from "../custom/ApiError.js";

type Payload = {
   sub: string
}

export const generateToken = (payload: Payload,secret: string,expiresIn: number) => {
    const token = jwt.sign(payload,secret,{
        algorithm: "HS256",
        expiresIn 
    });
    return token;
}

export const verifyToken = (token: string,secret: string,) => {
    try {
        const decode = jwt.verify(token,secret,{
            algorithms: ["HS256"]
        });
        return decode;   
    } catch (error: any) {
        throw new ApiError(ErrorType.UNAUTHORIZED,ErrorCode.UNAUTHORIZED,error.message,true);
    }
}