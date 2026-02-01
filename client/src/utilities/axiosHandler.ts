import type { SignupUserType } from "@/schemas/signupUser";
import type { AxiosResponse } from "axios";

type User = Omit<SignupUserType,"confirmPassword" | "password"> & { _id: string };

type LoginData = {
   user: User
   accessToken: string
}

type RefreshData = {
   accessToken: string 
}

type SignupData = {
   user: User
}
type LogoutData = {}
type Data = LoginData | RefreshData | LogoutData | SignupData

interface ReturnData {
   state: "success"
   error: null
   data: Data
   meta: {
        timestamp: string
   }
}

export interface LoginReturn extends ReturnData {
   data: LoginData
}
export interface LogoutReturn extends ReturnData {
   data: LogoutData
}
export interface RefreshReturn extends ReturnData {
   data: RefreshData
}
export interface SignupReturn extends ReturnData {
   data: SignupData
}

export const axiosHandler = <TArgs extends any[],TReturn>(apiCall: (...args: TArgs) => Promise<AxiosResponse<TReturn>>) => (async(...params: TArgs): Promise<TReturn> => {
        try {
           const response = await apiCall(...params);
           return response.data;
        } catch (error: any) {
                    if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                    // Rethrow Error handle by tanstack query
                    throw new Error(error.response.data?.error?.detail);
                    } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                    // Rethrow Error handle by tanstack query
                    throw new Error("Request Fail");
                    } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    // Rethrow Error handle by tanstack query
                    throw new Error("Something went wrong");
                    }
        }
})