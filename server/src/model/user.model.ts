import mongoose from "mongoose";
import v from "validator";
import { comparePassword, hashPassword } from "../utilities/passwordUtilities.js";
import { ApiError, ErrorCode, ErrorType } from "../custom/ApiError.js";
import { env } from "../config/env.config.js";

interface IUser extends mongoose.Document {
    username: string
    email: string
    password: string
    isAdmin: boolean
    loginAttempts: number
    loginUtils: number
}

interface IUserMethods {
    passwordCompare(password: string): Promise<boolean>;
}

type UserModelType = mongoose.Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModelType, IUserMethods>({
    username: {
        type: String,
        required: [true,"Username required"],
        minLength: [2,"Username at least two character"],
        // Prevent large data
        maxLength: [60,"Username at most sixty character"],
        match: [/^[A-Za-z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
        trim: true,
        unique: true,
        // Remove dangerous character 
        setter: (val: string) => {
            const stripedString = '\'`"\\\\/<>&';
            return v.blacklist(val,stripedString);
        }
    },
    email: {
        type: String,
        required: [true,"Email required"],
        // Prevent large data
        maxLength: [60,"Email at most sixty character"],
        trim: true,
        unique: true,
        // Prevent duplicate email
        lowercase: true,
        validate: {
           validator: (val: string) => {
               return v.isEmail(val);
           },
           message: "Invalid Email"
        }
    },
    password: {
        type: String,
        minLength: [8,"Password at least eight character"],
        trim: true,
        required: [true,"Password required"],
        // Prevent accidentally select
        select: false,
        validate: {
           validator: (val: string) => {
               return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(val);
           },
           message: "Password should include small and big letter and number and one special character"
        }
    },
    isAdmin: {
        type: Boolean,
        default: false,
        // Prevent accidentally change
        immutable: true
    },
    loginAttempts: {
        type: Number,
        min: [0,"Attempts time not allow negative"],
        max: [3,"Attempts time not greater than three"],
        default: 0,
        required: [true,"LoginAttempts required"],
    },
    loginUtils: {
        type: Number,
        // Minus one for nothing
        default: -1,
    }
},{
    timestamps: true
})
// Hash password before save
userSchema.pre("save",async function() {
    if(!this.isModified("password")) return;
        const salt = env.NODE_ENV==="test"?5:12;
        const hashedPassword = await hashPassword(this.password,salt);
        this.password = hashedPassword;
    return;
})
// Instance function reduce service code
userSchema.methods.passwordCompare = async function (password: string) {

    const isMatch = await comparePassword(password,this.password);
    return isMatch;
}
// Handle error perform by create and save
userSchema.post("save", async function (error: any, _: any,__: any) {
    // Handle Duplicate Key (Conflict)
    if (error.name === "MongoServerError" && error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        throw new ApiError(
            ErrorType.SERVER_CONFLICT,
            ErrorCode.SERVER_CONFLICT,
            `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`,
            true
        );
    }

    // Handle Validation Errors (Bad Request)
    if (error.name === "ValidationError") {
        // Extract the first validation message found
        const firstErrorField = Object.keys(error.errors)[0];
        const message = error.errors[firstErrorField].message;
        
        throw new ApiError(
            ErrorType.BAD_REQUEST,
            ErrorCode.BAD_REQUEST,
            message,
            true
        );
    }

    // 3. Handle Casting Errors (Bad Request)
    if (error.name === "CastError") {
        throw new ApiError(
            ErrorType.BAD_REQUEST,
            ErrorCode.BAD_REQUEST,
            `Invalid format for ${error.path}`,
            true
        );
    }

    // Fallback for Unknown Internal Errors
    throw new ApiError(
        ErrorType.SERVER_ERROR,
        ErrorCode.SERVER_ERROR,
        error.message || "An unexpected database error occurred.",
        false // Not operational because it's an unhandled internal error
    );
});

export const UserModel = mongoose.model<IUser, UserModelType>("users",userSchema);