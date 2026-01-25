import { ZodObject } from "zod";
import { asyncHandler } from "./asyncHandler.js";
import { ApiError, ErrorCode, ErrorType } from "../custom/ApiError.js";
import { LoginUserType } from "../schema/loginUser.schema.js";
import { CreateUserType } from "../schema/creatUser.schema.js";

export const userSchemaValidator = (schema: ZodObject) => asyncHandler((req,_,next) => {
      const result = schema.safeParse(req.body);
      if(!result.success) throw new ApiError(ErrorType.BAD_REQUEST,ErrorCode.BAD_REQUEST,result.error.issues[0].message,true);
      // Persist the formatted data to the controller
      req.user = result.data as (LoginUserType | CreateUserType);
      return next();
})