import axios from "axios"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Sort } from "./filterSlice";

type Pizza = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  sizes: number[];
  types: number[];
}

export enum Status {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

interface PizzaSliceState {
  items: Pizza[];
  status: Status;
}

const initialState: PizzaSliceState = {
  items: [],
  status: Status.LOADING,
};

export type SearchPizzaParams = {
  sortBy: string;
   order: string;
  search: string;
  category: string;
   currentPage: string;
}

export const fetchPizzas = createAsyncThunk<Pizza[], SearchPizzaParams>(
  "pizza/fetchPizzasStatus",
  async (params) => {
    const { sortBy, order, search, category, currentPage } = params;
    const { data } = await axios.get(
      `https://628e7a35368687f3e7179014.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
    );
    return data;
  }
);

const pizzaSlice = createSlice({
  name: "pizza",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<Pizza[]>) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
  builder.addCase(fetchPizzas.pending, (state, action) => {
    state.status = Status.LOADING;
    state.items = [];
  });

  builder.addCase(fetchPizzas.fulfilled, (state, action) => {
    state.items = action.payload;
    state.status = Status.SUCCESS;
  });

  builder.addCase(fetchPizzas.rejected, (state, action) => {
    state.status = Status.ERROR;
    state.items = [];
  });
  },

});

export const selectPizzaData = (state: RootState) => state.pizza;

export const { setItems } = pizzaSlice.actions;

export default pizzaSlice.reducer;
