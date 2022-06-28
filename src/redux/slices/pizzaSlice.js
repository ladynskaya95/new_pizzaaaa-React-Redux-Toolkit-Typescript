import axios from "axios"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchPizzas = createAsyncThunk("pizza/fetchPizzasStatus", async (params) => {
  const { sortBy, order, search, category, currentPage } = params;
  const { data } = await axios.get(
    `https://628e7a35368687f3e7179014.mockapi.io/items?page=${currentPage}&limit=8&${category}&sortBy=${sortBy}&order=${order}${search}`
  );
  return data;
});

const initialState = {
  items: [],
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
    [fetchPizzas.pending]: (state, action) => {
      console.log("Идет отправка");
    },
    [fetchPizzas.fulfilled]: (state, action) => {
      console.log(state, "Все ок");
    },
    [fetchPizzas.reject]: (state, action) => {
      console.log("Была ошибка");
    },
  },
});

export const { setItems } = pizzaSlice.actions;

export default pizzaSlice.reducer;
