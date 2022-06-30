import axios from "axios"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchPizzas = createAsyncThunk("pizza/fetchPizzasStatus", async (params, thunkApi) => {
  const { sortBy, order, search, category, currentPage } = params;
  const { data } = await axios.get(
    `https://628e7a35368687f3e7179014.mockapi.io/items?page=${currentPage}&limit=8&${category}&sortBy=${sortBy}&order=${order}${search}`
  );
  return data;
});

const initialState = {
  items: [],
  status: "success"
};

const pizzaSlice = createSlice({
  name: "pizza",
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
    },
  },
  extraReducers: {
    [fetchPizzas.pending]: (state) => {
      state.status = "loading";
       state.items = [];
    },
    [fetchPizzas.fulfilled]: (state, action) => {
      state.items = action.payload;
      state.status = "success"
    },
    [fetchPizzas.rejected]: (state, action) => {
      state.status = "error";
      state.items = []
    },
  },
});

export const selectPizzaData = (state) => state.pizza;

export const { setItems } = pizzaSlice.actions;

export default pizzaSlice.reducer;
