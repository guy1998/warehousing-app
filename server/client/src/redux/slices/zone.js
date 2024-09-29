import { createSlice } from '@reduxjs/toolkit';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  zones: [],
  zone: null,
};

const slice = createSlice({
  name: 'zone',
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
    getZonesSuccess(state, action) {
      state.isLoading = false;
      state.zones = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getZones() {
  return async () => {
    dispatch(slice.actions.startLoading());

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/client/zones/retrieve`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      dispatch(slice.actions.getZonesSuccess(data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// export const getZoneInfo = async (notification, zone) => {
//   const response = await fetch(`https://www.salesprendi.com/clientCount/${zone}`, {
//     method: 'GET',
//     headers: { 'Content-Type': 'application/json' },
//     credentials: 'include',
//   });
//   if (response.status === 200) {
//     const data = await response.json();
//     return data;
//   }
//   if (response.status === 401) {
//     notification.add('Session has already finished!', { variant: 'info' });
//     logout();
//   } else {
//     notification.add('Server is not responding right now!', { variant: 'error' });
//   }
// };

// export const createZone = async (notification, zoneInfo, afterAction) => {
//   console.log('NEW: ', zoneInfo);
//   const response = await fetch('https://www.salesprendi.com/zone', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include',
//     body: JSON.stringify({ newZone: zoneInfo }),
//   });
//   if (response.status === 201 || response.status === 200) {
//     console.log(response);
//     notification.add('Zone added successfully!', { variant: 'success' });
//     afterAction();
//   } else if (response.status === 401) {
//     notification.add('Session has already finished!', { variant: 'info' });
//     logout();
//   } else {
//     const message = await response.json();
//     notification.add(message.message, { variant: 'error' });
//   }
// };

// export const editZone = async (notification, oldZone, newZone, action) => {
//   const response = await fetch(`${url}editZone`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     credentials: 'include',
//     body: JSON.stringify({ oldZone, newZone }),
//   });

//   if (response.status === 200 || response.status === 201) {
//     notification.add('Information updated!', { variant: 'success' });
//     if (action) action();
//   } else if (response.status === 401) {
//     notification.add('Session has already finished!', { variant: 'info' });
//     logout();
//   } else {
//     const message = await response.json();
//     notification.add(message.message, { variant: 'error' });
//   }
// };
