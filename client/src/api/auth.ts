import { axiosHandler, type ReturnData } from "@/utilities/axiosHandler";
import { authAxios } from "./authAxios";
import type { LoginUserType } from "@/schemas/loginUser";
import type { SignupUserType } from "@/schemas/signupUser";

export const login = axiosHandler((loginUser: LoginUserType) => {
    return authAxios.post<ReturnData>("/login",loginUser);
})

export const signup = axiosHandler((signupUser: SignupUserType) => {
    return authAxios.post<ReturnData>("/signup",signupUser);
})

export const refresh = axiosHandler(() => {
    return authAxios.get<ReturnData>("/refresh",{
        withCredentials: true
    });
})

export const logout = axiosHandler(() => {
    return authAxios.delete<ReturnData>("/logout",{
        withCredentials: true
    });
})
