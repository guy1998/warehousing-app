import { createSlice } from '@reduxjs/toolkit';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  categories: [],
  category: null,
};

const slice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.categories = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getCategories() {
  return async () => {
    dispatch(slice.actions.startLoading());

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/product/categories/retrieve`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      dispatch(slice.actions.getCategoriesSuccess(data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
