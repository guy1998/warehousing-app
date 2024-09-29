import { logout } from '../../auth/login/scripts';

const url = `${process.env.REACT_APP_BACKEND_URL}/product/`;

export const getAllCategories = async (notification) => {
  const response = await fetch(`${url}categories/retrieve`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (response.status === 200) {
    const data = await response.json();
    return data;
  }
  if (response.status === 401) {
    notification.add('Session has already finished!', { variant: 'info' });
    logout();
  } else {
    notification.add('Server is not responding right now!', { variant: 'error' });
  }
};

export const getAllUnits = async (notification) => {
  const response = await fetch(`${url}units/retrieve`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (response.status === 200) {
    const data = await response.json();
    return data;
  }
  if (response.status === 401) {
    notification.add('Session has already finished!', { variant: 'info' });
    logout();
  } else {
    notification.add('Server is not responding right now!', { variant: 'error' });
  }
};
