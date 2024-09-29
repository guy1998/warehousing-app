import { logout } from '../../../auth/login/scripts';

const url = `${process.env.REACT_APP_BACKEND_URL}/sales/`;

export const getMySales = async (notification, navigator, filter) => {
  let data = [];
  const response = await fetch(`${url}get-my-sales`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filter }),
    credentials: 'include',
  });
  if (response.status === 200) {
    data = await response.json();
  } else if (response.status === 401) {
    notification.add('Session has already ended!', { variant: 'info' });
    logout(notification, navigator);
  } else {
    notification.add('Server could not handle the request!', { variant: 'error' });
  }
  return data;
};

export const getAllSales = async (notification, navigator, filter) => {
  let data = [];
  const response = await fetch(`${url}filter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filter }),
    credentials: 'include',
  });
  if (response.status === 200) {
    data = await response.json();
  } else if (response.status === 401) {
    notification.add('Session has already ended!', { variant: 'info' });
    logout(notification, navigator);
  } else {
    notification.add('Server could not handle the request!', { variant: 'error' });
  }
  return data;
};

export const dispatchSale = async (notification, navigator, saleId, action) => {
  const response = await fetch(`${url}dispatch`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ saleId }),
    credentials: 'include',
  });
  if (response.status === 200) {
    notification.add('Sale was dispatched successfully!', { variant: 'success' });
    action();
  } else if (response.status === 401) {
    notification.add('Session has already ended!', { variant: 'info' });
    logout(notification, navigator);
  } else {
    const message = await response.json();
    notification.add(message.message, { variant: 'error' });
  }
};

export const confirmSale = async (notification, navigator, saleId, action) => {
  const response = await fetch(`${url}confirm`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ saleId }),
    credentials: 'include',
  });
  if (response.status === 200) {
    notification.add('Sale was confirmed successfully!', { variant: 'success' });
    action();
  } else if (response.status === 401) {
    notification.add('Session has already ended!', { variant: 'info' });
    logout(notification, navigator);
  } else {
    const message = await response.json();
    notification.add(message.message, { variant: 'error' });
  }
};

export const addSaleReturn = async (notification, navigator, saleId, returnInformation) => {
  const response = await fetch(`${url}sale-return`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ saleId, returnInformation }),
    credentials: 'include',
  });
  if (response.status === 200) {
    notification.add('Return was saved!', { variant: 'success' });
    navigator('/admin/sales/list');
  } else if (response.status === 401) {
    notification.add('Session has already ended!', { variant: 'info' });
    logout(notification, navigator);
  } else {
    const message = await response.json();
    notification.add(message.message, { variant: 'error' });
  }
};

export const getSalesInfo = async (notification, navigator, saleId) => {
  let data = [];
  const response = await fetch(`${url}filter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ filter: { _id: saleId } }),
  });
  if (response.status === 200) {
    data = await response.json();
  } else if (response.status === 401) {
    notification.add('Session is already over!', { variant: 'info' });
    await logout(navigator, notification);
  } else {
    notification.add('Server could not handle the request!', { variant: 'error' });
  }
  return data.length ? data[0] : null;
};

export const getSaleReturns = async (notification, navigator) => {
  let data = [];
  const response = await fetch(`${url}sale-returns`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (response.status === 200) {
    data = await response.json();
  } else if (response.status === 401) {
    notification.add('Session has already ended!', { variant: 'info' });
    logout(notification, navigator);
  } else {
    notification.add('Server could not handle the request!', { variant: 'error' });
  }
  return data;
};

export const markAsRecievied = async (notification, navigator, returnId, action) => {
  const response = await fetch(`${url}mark-received`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ returnId }),
    credentials: 'include',
  });
  if (response.status === 200) {
    notification.add('Sale return was received successfully!', { variant: 'success' });
    action();
  } else if (response.status === 401) {
    notification.add('Session has already ended!', { variant: 'info' });
    logout(notification, navigator);
  } else {
    const message = await response.json();
    notification.add(message.message, { variant: 'error' });
  }
};

export const markAsLost = async (notification, navigator, returnId, action) => {
  const response = await fetch(`${url}mark-lost`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ returnId }),
    credentials: 'include',
  });
  if (response.status === 200) {
    notification.add('Sale return was marked as lost!', { variant: 'info' });
    action();
  } else if (response.status === 401) {
    notification.add('Session has already ended!', { variant: 'info' });
    logout(notification, navigator);
  } else {
    const message = await response.json();
    notification.add(message.message, { variant: 'error' });
  }
};
