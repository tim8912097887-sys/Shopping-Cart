import { env } from "../config/env.config.js";
import { ApiError, ErrorCode, ErrorType } from "../custom/ApiError.js"
import { CreateUserType } from "../schema/creatUser.schema.js";
import { LoginUserType } from "../schema/loginUser.schema.js";
import { createUser, loginUser } from "../service/user.service.js";
import { asyncHandler } from "../utilities/asyncHandler.js"
import { responseEnvelope } from "../utilities/responseEnvelope.js";
import { generateToken, verifyToken } from "../utilities/tokenUtilities.js";

export const signupController = asyncHandler(async(req,res) => {

    if(!req.user) throw new ApiError(ErrorType.BAD_REQUEST,ErrorCode.BAD_REQUEST,"Bad Request",true);
    const createdUser = await createUser(req.user as CreateUserType);
    const data = { user: createdUser };
    res.status(201).json(responseEnvelope("success",{ data }));
})

export const loginController = asyncHandler(async(req,res) => {

    if(!req.user) throw new ApiError(ErrorType.BAD_REQUEST,ErrorCode.BAD_REQUEST,"Bad Request",true);
    const existUser = await loginUser(req.user as LoginUserType);
    const payload = { sub: existUser._id.toString() };
    const accessTokenExpired = Number(env.ACCESS_TOKEN_EXPIRED);
    const accessToken = generateToken(payload,env.ACCESS_TOKEN_SECRET,accessTokenExpired);
    const refreshTokenExpired = Number(env.REFRESH_TOKEN_EXPIRED);
    const refreshToken = generateToken(payload,env.REFRESH_TOKEN_SECRET,refreshTokenExpired);
    const data = { user: existUser,accessToken };
    res.cookie("refreshToken",refreshToken,{
        sameSite: "lax",
        // Secure cookie
        httpOnly: true,
        // Same as refresh token
        maxAge: Number(env.REFRESH_TOKEN_EXPIRED),
        secure: env.NODE_ENV==="production"
    })
    res.status(200).json(responseEnvelope("success",{ data }));
})

export const logoutController = asyncHandler((_,res) => {
    // The config option must match
    res.clearCookie("refreshToken",{
        sameSite: "lax",
        // Secure cookie
        httpOnly: true,
        secure: env.NODE_ENV==="production"
    })
    res.status(200).json(responseEnvelope("success",{}));
})

export const refreshController = asyncHandler((req,res) => {
    const { refreshToken } = req.cookies;
    if(!refreshToken) throw new ApiError(ErrorType.UNAUTHORIZED,ErrorCode.UNAUTHORIZED,"Unauthentication",true);
    const decode = verifyToken(refreshToken,env.REFRESH_TOKEN_SECRET);
    const payload = { sub: decode.sub as string };
     const accessTokenExpired = Number(env.ACCESS_TOKEN_EXPIRED);
    const accessToken = generateToken(payload,env.ACCESS_TOKEN_SECRET,accessTokenExpired);
    const refreshTokenExpired = Number(env.REFRESH_TOKEN_EXPIRED);
    const newRefreshToken = generateToken(payload,env.REFRESH_TOKEN_SECRET,refreshTokenExpired);
    const data = { accessToken };
    // Refresh token rotation
    res.cookie("refreshToken",newRefreshToken,{
        sameSite: "lax",
        // Secure cookie
        httpOnly: true,
        // Same as refresh token
        maxAge: Number(env.REFRESH_TOKEN_EXPIRED),
        secure: env.NODE_ENV==="production"
    })
    res.status(200).json(responseEnvelope("success",{ data }));
})