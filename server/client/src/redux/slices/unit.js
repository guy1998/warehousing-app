import { createSlice } from '@reduxjs/toolkit';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  units: [],
  unit: null,
};

const slice = createSlice({
  name: 'unit',
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
    getUnitsSuccess(state, action) {
      state.isLoading = false;
      state.units = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getUnits() {
  return async () => {
    dispatch(slice.actions.startLoading());

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/product/units/retrieve`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      dispatch(slice.actions.getUnitsSuccess(data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
