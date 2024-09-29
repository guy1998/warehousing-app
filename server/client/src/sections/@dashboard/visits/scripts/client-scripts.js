import { logout } from '../../../auth/login/scripts';

const url = `${process.env.REACT_APP_BACKEND_URL}/client/`;

export const getClients = async (notification, navigator) => {
  let data = [];
  const response = await fetch(`${url}allclients`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (response.status === 200) {
    data = await response.json();
  } else if (response.status === 401) {
    notification.add('Session is already over!', { variant: 'info' });
    await logout(notification, navigator);
  } else {
    notification.add('Server could not handle the request!', { variant: 'error' });
  }
  return data;
};

export const getZones = async (notification, navigator) => {
  let data = [];
  const response = await fetch(`${url}zones/retrieve`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (response.status === 200) {
    data = await response.json();
  } else if (response.status === 401) {
    notification.add('Session is already over!', { variant: 'info' });
    await logout(notification, navigator);
  } else {
    notification.add('Server could not handle the request!', { variant: 'error' });
  }
  return data;
};

export const getCities = async () => {};
