import { logout } from '../../auth/login/scripts';

const url = `${process.env.REACT_APP_BACKEND_URL}/user/`;

export const createUser = async (notification, userInfo, afterAction) => {
  const response = await fetch(`${url}create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userInfo),
  });
  if (response.status === 201) {
    notification.add('User added successfully!', { variant: 'success' });
    afterAction();
  } else if (response.status === 401) {
    notification.add('Session has already finished!', { variant: 'info' });
    logout();
  } else {
    const message = await response.json();
    notification.add(message.message, { variant: 'error' });
  }
};

export const editUser = async (notification, userId, newInfo, action) => {
  const response = await fetch(`${url}put/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(newInfo),
  });
  if (response.status === 200) {
    notification.add('Information updated!', { variant: 'success' });
    if (action) action();
  } else if (response.status === 401) {
    notification.add('Session has already finished!', { variant: 'info' });
    logout();
  } else {
    const message = await response.json();
    notification.add(message.message, { variant: 'error' });
  }
};

export const editOwnInformation = async (notification, newInfo) => {
  const response = await fetch(`${url}edit/my-data`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(newInfo),
  });
  if (response.status === 200) {
    notification.add('Information updated!', { variant: 'success' });
  } else if (response.status === 401) {
    notification.add('Session has already finished!', { variant: 'info' });
    logout();
  } else {
    const message = await response.json();
    notification.add(message.message, { variant: 'error' });
  }
};

export const changePassword = async (notification, newPassword, oldPassword, afterAll) => {
  const response = await fetch(`${url}changePassword`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newPassword, oldPassword }),
    credentials: 'include',
  });
  if (response.status === 200) {
    notification.add('Password changed successfully!', { variant: 'success' });
    afterAll();
  } else if (response.status === 401) {
    notification.add('Session has already finished!', { variant: 'info' });
    logout();
  } else {
    const message = await response.json();
    notification.add(message.message, { variant: 'error' });
  }
};

export const deleteUser = async () => {};

export const getOwnInformation = async (notification) => {
  const response = await fetch(`${url}account`, {
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

export const getAllUsers = async (notification) => {
  const response = await fetch(`${url}getAll`, {
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

export const getUserInfo = async (notification, userId) => {
  const response = await fetch(`${url}get/${userId}`, {
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
