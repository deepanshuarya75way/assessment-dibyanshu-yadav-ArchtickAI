import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_URL = import.meta.env.VITE_API_URL;

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    error: null,
}

export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData: any, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.detail || "Signup failed");
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials: any, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.detail || "Login failed");
            localStorage.setItem("token", data.token);

            // After successful login, fetch user info
            const userResponse = await fetch(`${API_URL}/auth/is-auth`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${data.token}` },
            });
            const userData = await userResponse.json();
            if (!userResponse.ok) return rejectWithValue("Failed to fetch user info after login");

            return { token: data.token, user: userData };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const checkAuth = createAsyncThunk(
    "auth/is-auth",
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem("token");
        if (!token) return rejectWithValue("No token found");
        try {
            const response = await fetch(`${API_URL}/auth/is-auth`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` },
            });
            const data = await response.json();
            if (!response.ok) {
                localStorage.removeItem("token");
                return rejectWithValue(data.detail || "Auth check failed");
            }
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Check Auth
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;