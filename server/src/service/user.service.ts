import { ApiError, ErrorCode, ErrorType } from "../custom/ApiError.js";
import { UserModel } from "../model/user.model.js";
import { CreateUserType } from "../schema/creatUser.schema.js";
import { LoginUserType } from "../schema/loginUser.schema.js";
import { env } from "../config/env.config.js";

export const createUser = async(user: CreateUserType) => {

    const { confirmPassword,...withoutConfirmPasswor } = user;
    const result = await UserModel.create(withoutConfirmPasswor);
    const createdUser = result.toObject();
    if(!createdUser._id) throw new ApiError(ErrorType.SERVER_CONFLICT,ErrorCode.SERVER_CONFLICT,"Fail to Create",true);
    const { password,...withoutPassword } = createdUser;
    return withoutPassword;
}

export const loginUser = async(user: LoginUserType) => {

    const existUser = await UserModel.findOne({ email: user.email }).select("+password");
    if(!existUser) throw new ApiError(ErrorType.BAD_REQUEST,ErrorCode.BAD_REQUEST,`Email or Password is not correct`,true);
    // Check if it's currently locked
    const isLock = existUser.loginUtils && existUser.loginUtils>Date.now();
    if(isLock) throw new ApiError(ErrorType.FORBIDDEN,ErrorCode.FORBIDDEN,"User account is locked",true);
    const isMatch = await existUser.passwordCompare(user.password);

    if(!isMatch) {
        existUser.loginAttempts++;
        if(existUser.loginAttempts>=Number(env.ATTEMPT_TIME)) {
            existUser.loginUtils = Date.now()+Number(env.ACCOUNT_LOCK_TIME);
            existUser.loginAttempts = 0;
        }
        // Wait for data store
        await existUser.save();
        throw new ApiError(ErrorType.BAD_REQUEST,ErrorCode.BAD_REQUEST,`Email or Password is not correct`,true);
    } 
    // Reset attempt state when success
    if(existUser.loginAttempts>0 || existUser.loginUtils) {
          existUser.loginAttempts = 0;
          existUser.loginUtils = -1;
          // Wait for data store
          await existUser.save();
    }
    const { password,...withoutPassword } = existUser.toObject();
    return withoutPassword;
}