import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../utils/axiosHelper";

const getGeoCodeData = createAsyncThunk(
  "dashboard/getGeoCodeData",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        import.meta.env.VITE_API_BASE_URL_GEOCODE,
        {
          params: {
            name: query,
            count: 3,
            language: "en",
            format: "json",
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const getWeatherData = createAsyncThunk(
  "dashboard/getWeatherData",
  async (weatherParams, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        import.meta.env.VITE_API_BASE_URL,
        {
          params: weatherParams,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    data: {
      geoCodeData: null,
      weatherData: null,
    },
    loading: false,
    error: null,
  },
  reducers: {
    setLocalGeoCodeData: (state, action) => {
      state.data.geoCodeData = action.payload;
    },
    setLocalWeatherData: (state, action) => {
      state.data.weatherData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGeoCodeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGeoCodeData.fulfilled, (state, action) => {
        state.loading = false;
        state.data.geoCodeData = action.payload;
        console.log("GeoCode Data:", action.payload);
      })
      .addCase(getGeoCodeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.data.weatherData = action.payload;
      })
      .addCase(getWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
export const { setLocalGeoCodeData, setLocalWeatherData } =
  dashboardSlice.actions;
export { getGeoCodeData, getWeatherData };
