import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name : 'auth',
    initialState : {
        isAuthentic : false,
    },
    reducers : {
        login : (state) => {
            state.isAuthentic = true;
        },
        logout : (state) => {
            state.isAuthentic = false;
        },
    },
});

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;