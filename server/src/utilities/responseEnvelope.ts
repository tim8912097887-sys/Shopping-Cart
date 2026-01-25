import mongoose from "mongoose";
import { CreateUserType } from "../schema/creatUser.schema.js";

type State = "success" | "error";

type ErrorObject = {
    status: number
    detail: string
}

type User = Omit<CreateUserType,"confirmPassword" | "password"> & { _id: mongoose.Types.ObjectId }

type Data = {
   user: User
   accessToken?: string
} | { accessToken: string }
type PartialResponse = {
   data?: Data | null
   error?: ErrorObject | null
}

type ResponseStructure = {
    state: State
    data: Data | null
    error: ErrorObject | null
    meta: {
        timestamp: string
    }
}

export const responseEnvelope = (state: State,response: PartialResponse): ResponseStructure => {
    if(response.data === undefined) response.data = null;
    if(response.error === undefined) response.error = null;
    return { ...response as { data: Data,error: ErrorObject },state,meta: {
        timestamp: new Date().toISOString()
    } };
}