import { ApiError, ErrorCode, ErrorType } from "../custom/ApiError.js";
import { UserModel } from "../model/user.model.js";
import { CreateUserType } from "../schema/creatUser.schema.js";
import { LoginUserType } from "../schema/loginUser.schema.js";

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
    const isMatch = await existUser.passwordCompare(user.password);
    if(!isMatch) throw new ApiError(ErrorType.BAD_REQUEST,ErrorCode.BAD_REQUEST,`Email or Password is not correct`,true);
    const { password,...withoutPassword } = existUser.toObject();
    return withoutPassword;
}