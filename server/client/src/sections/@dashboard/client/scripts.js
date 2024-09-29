import { logout } from '../../auth/login/scripts';

const url = `${process.env.REACT_APP_BACKEND_URL}/client/`;

export const createClient = async (notification, clientInfo, afterAction) => {
  const response = await fetch(`${url}createclient`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(clientInfo),
  });
  if (response.status === 201 || response.status === 200) {
    console.log(response);
    notification.add('Client added successfully!', { variant: 'success' });
    afterAction();
  } else if (response.status === 401) {
    notification.add('Session has already finished!', { variant: 'info' });
    logout();
  } else {
    const message = await response.json();
    notification.add(message.message, { variant: 'error' });
  }
};

export const editClient = async (notification, clientId, newInfo, action) => {
  const response = await fetch(`${url}updateclient/${clientId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(newInfo),
  });
  console.log(newInfo);
  if (response.status === 200 || response.status === 201) {
    notification.add('Information updated!', { variant: 'success' });
    if (action) action();
  } else if (response.status === 401) {
    notification.add('Session has already finished!', { variant: 'info' });
    logout();
  } else if (response.status === 400) {
    notification.add('The company name exists for another client!', { variant: 'error' });
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

export const deleteClient = async () => {};

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

export const getAllClients = async (notification) => {
  const response = await fetch(`${url}allclients`, {
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

export const getClientInfo = async (notification, clientId) => {
  const response = await fetch(`${url}getclient/${clientId}`, {
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

// ZONES

export const getAllZones = async (notification) => {
  const response = await fetch(`${url}zones/retrieve`, {
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

export const getZoneInfo = async (notification, zone) => {
  const response = await fetch(`${url}clientCount/${zone}`, {
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

export const createZone = async (notification, zoneInfo, afterAction) => {
  console.log('NEW: ', zoneInfo);
  const response = await fetch(`${url}zone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ newZone: zoneInfo }),
  });
  if (response.status === 201 || response.status === 200) {
    console.log(response);
    notification.add('Zone added successfully!', { variant: 'success' });
    afterAction();
  } else if (response.status === 401) {
    notification.add('Session has already finished!', { variant: 'info' });
    logout();
  } else {
    const message = await response.json();
    notification.add(message.message, { variant: 'error' });
  }
};

export const editZone = async (notification, oldZone, newZone, action) => {
  const response = await fetch(`${url}editZone`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ oldZone, newZone }),
  });

  if (response.status === 200 || response.status === 201) {
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
