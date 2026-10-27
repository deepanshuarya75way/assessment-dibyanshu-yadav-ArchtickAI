import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../configs/axios";

interface ProfileState {
  credits: number;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  credits: 0,
  loading: false,
  error: null,
};

export const fetchCredits = createAsyncThunk(
  "profile/fetchCredits",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/credits");
      return response.data.credits;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || "Failed to fetch credits");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCredits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCredits.fulfilled, (state, action) => {
        state.loading = false;
        state.credits = action.payload;
      })
      .addCase(fetchCredits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
