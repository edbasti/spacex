import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchLaunches = createAsyncThunk(
  "launches/fetchLaunches",
  async (page) => {
    const response = await fetch(
      `https://api.spacexdata.com/v3/launches?limit=10&offset=${(page - 1) * 10}`
    );
    return response.json();
  }
);

const launchesSlice = createSlice({
  name: "launches",
  initialState: {
    launches: [],
    loading: false,
    hasMore: true,
    search: "",
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLaunches.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLaunches.fulfilled, (state, action) => {
        if (action.payload.length === 0) {
          state.hasMore = false;
        }
        state.launches = [...state.launches, ...action.payload];
        state.loading = false;
      })
      .addCase(fetchLaunches.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setSearch } = launchesSlice.actions;
export default launchesSlice.reducer;
