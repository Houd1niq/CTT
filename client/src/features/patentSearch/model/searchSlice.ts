import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SearchSliceState} from "@features/patentSearch/model/types.ts";

const initialState: SearchSliceState = {
  patentTypeFilters: [],
  technologyFieldFilters: [],
  instituteFilters: [],
  page: 1
};

const SearchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string | undefined>) {
      if (action.payload === undefined) state.searchQuery = undefined;
      else state.searchQuery = action.payload;
    },

    setTotalPages(state, action: PayloadAction<number>) {
      state.totalPages = action.payload;
    },

    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },

    setPatentSort(state, action: PayloadAction<string | undefined>) {
      if (action.payload === undefined) state.patentSort = undefined;
      else state.patentSort = action.payload;
    },

    setTechnologyFieldFilter(state, action: PayloadAction<number>) {
      state.technologyFieldFilters = [...state.technologyFieldFilters, action.payload];
    },

    removeTechnologyFieldFilter(state, action: PayloadAction<number>) {
      state.technologyFieldFilters = state.technologyFieldFilters.filter((filter) => filter !== action.payload);
    },

    setInstituteFilter(state, action: PayloadAction<number>) {
      state.instituteFilters = [...state.instituteFilters, action.payload];
    },

    removeInstituteFilter(state, action: PayloadAction<number>) {
      state.instituteFilters = state.instituteFilters.filter((filter) => filter !== action.payload);
    },

    setPatentTypeFilter(state, action: PayloadAction<number>) {
      state.patentTypeFilters = [...state.patentTypeFilters, action.payload];
    },

    removePatentTypeFilter(state, action: PayloadAction<number>) {
      state.patentTypeFilters = state.patentTypeFilters.filter((filter) => filter !== action.payload);
    }
  },
});


export const searchReducer = SearchSlice.reducer
export const {
  setPatentTypeFilter,
  removePatentTypeFilter,
  setTechnologyFieldFilter,
  removeTechnologyFieldFilter,
  setPatentSort,
  setSearchQuery,
  setPage,
  setTotalPages,
  setInstituteFilter,
  removeInstituteFilter
} = SearchSlice.actions;
