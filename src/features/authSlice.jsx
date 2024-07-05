import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    user: null,
    isError: false,
    isSucces: false,
    isLoading: false,
    message: '',
    token: null

}

export const loginUser = createAsyncThunk('user/loginUser', async (user, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:3000/v1/login', {
            email: user.email,
            password: user.password
        });
        return response.data;

    } catch (_e) {
        console.log("Error de Login: ", _e);
        const { error } = _e.response.data
        console.log("Error de Login: ", error)
        return thunkAPI.rejectWithValue(error.data.message);
    }
})

export const loginUserGmail = createAsyncThunk('user/loginUserGmail', async (data, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:3000/v1/google-login', {
            email: data.email, nombre: data.given_name, apellido: data.family_name
        });
        return response.data;

    } catch (_e) {
        console.log("Error de Login: ", _e);
        const { error } = _e.response.data
        console.log("Error de Login: ", error)
        return thunkAPI.rejectWithValue(error.data.message);
    }
})

export const getMe = createAsyncThunk('user/getMe', async (_, thunkAPI) => {
    try {
        const response = await axios.get('http://localhost:3000/v1/private/get/user');
        return response.data;

    } catch (_e) {
        console.log("Error de getMe: ", _e);
        const { error } = _e.response.data;
        console.log("Error de getMe: ", error);
        return thunkAPI.rejectWithValue(error.data.message);
    }
});

export const logOut = createAsyncThunk('user/LogOut', async () => {

    const response = await axios.delete('http://localhost:3000/v1/logout');
    console.log(response)

})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            console.log(action)
            const { data } = action.payload.body;
            state.isLoading = false;
            state.isSucces = true;
            state.user = data.user;
            state.message = data.message;
            state.token = data.token.accessToken
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.isLoading = true;
            state.isError = true;
            state.message = action.payload;
        });

        builder.addCase(loginUserGmail.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(loginUserGmail.fulfilled, (state, action) => {
            console.log(action)
            const { data } = action.payload.body;
            state.isLoading = false;
            state.isSucces = true;
            state.user = data.user;
            state.message = data.message;
            state.token = data.token.accessToken
        });
        builder.addCase(loginUserGmail.rejected, (state, action) => {
            state.isLoading = true;
            state.isError = true;
            state.message = action.payload;
        });

        // Get User Login
        builder.addCase(getMe.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getMe.fulfilled, (state, action) => {
            
            const { data } = action.payload.body;
            state.isLoading = false;
            state.user = data.user;
            state.isSucces = true;
            state.message = data.message;
            state.token = data.token
            state.pages = data.pages


        });
        builder.addCase(getMe.rejected, (state, action) => {
            state.isLoading = true;
            state.isError = true;
            state.message = action.payload;
        });
    }
})


export const { reset } = authSlice.actions;
export default authSlice.reducer;