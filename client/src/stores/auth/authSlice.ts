import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
    accessToken: string
    isPersistent: boolean
}

const initialState: InitialState = {
    accessToken: "",
    isPersistent: localStorage.getItem("persistent")?true:false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginUser: (state,action: PayloadAction<InitialState>) => {
             state.accessToken = action.payload.accessToken;
             state.isPersistent = action.payload.isPersistent;
             if(action.payload.isPersistent) localStorage.setItem("persistent","true");
        },
        logoutUser: (state) => {
            state.accessToken = "";
            localStorage.removeItem("persistent")
        },
        refresh: (state,action: PayloadAction<InitialState>) => {
            state.accessToken = action.payload.accessToken;
        }
    } 
})

export const { loginUser,logoutUser,refresh } = authSlice.actions;
export default authSlice.reducer;