import { axiosHandler, type LoginReturn, type LogoutReturn, type RefreshReturn, type SignupReturn } from "@utilities/axiosHandler";
import { authAxios } from "@api/authAxios";
import type { LoginUserType } from "@schemas/loginUser";
import type { SignupUserType } from "@schemas/signupUser";

export const login = axiosHandler((loginUser: LoginUserType) => {
    return authAxios.post<LoginReturn>("/login",loginUser,{
        withCredentials: true
    });
})

export const signup = axiosHandler((signupUser: SignupUserType) => {
    return authAxios.post<SignupReturn>("/signup",signupUser);
})

export const refresh = axiosHandler(() => {
    return authAxios.get<RefreshReturn>("/refresh",{
        withCredentials: true
    });
})

export const logout = axiosHandler(() => {
    return authAxios.delete<LogoutReturn>("/logout",{
        withCredentials: true
    });
})
