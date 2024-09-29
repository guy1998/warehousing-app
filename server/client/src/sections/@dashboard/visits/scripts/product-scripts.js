import { logout } from '../../../auth/login/scripts';

const url = `${process.env.REACT_APP_BACKEND_URL}/product/`;

export const getAllProducts = async (notification, navigator) => {
  let data = [];
  const response = await fetch(`${url}getallproduct`, {
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

export const productAdd = async (notification, navigator, products) => {
  let data = [];

  const response = await fetch(`${url}adjust/addition`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ products }),
    credentials: 'include',
  });

  if (response.status === 200) {
    data = await response.json();
    notification.add('Products adjusted successfully!', { variant: 'success' });
  } else if (response.status === 401) {
    notification.add('Session is already over!', { variant: 'info' });
    await logout(notification, navigator);
  } else {
    notification.add('Server could not handle the request!', { variant: 'error' });
  }
  return data;
};

export const productSubtract = async (notification, navigator, products) => {
  let data = [];

  const response = await fetch(`${url}adjust/subtraction`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ products }),
    credentials: 'include',
  });

  if (response.status === 200) {
    data = await response.json();
    notification.add('Products adjusted successfully!', { variant: 'success' });
  } else if (response.status === 400) {
    notification.add('You cannot subtract more than the quantity!', { variant: 'error' });
  } else if (response.status === 401) {
    notification.add('Session is already over!', { variant: 'info' });
    await logout(notification, navigator);
  } else {
    notification.add('Server could not handle the request!', { variant: 'error' });
  }
  return data;
};
