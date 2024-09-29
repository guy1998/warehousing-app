import { logout } from '../../../auth/login/scripts';

const url = `${process.env.REACT_APP_BACKEND_URL}/visit/`;

export const createVisit = async (notification, navigate, visit, action) => {
  const response = await fetch(`${url}create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ visit }),
  });
  if (response.status === 200) {
    notification.add('Visit was started successfully!', { variant: 'success' });
    action();
    navigate('/agent/visit/list');
  } else if (response.status === 401) {
    notification.add('Session is already over!', { variant: 'info' });
    await logout(notification, navigate);
  } else {
    notification.add('Server could not handle the request!', { variant: 'error' });
  }
};

export const getMyVisits = async (notification, navigate) => {
  let data = [];
  const response = await fetch(`${url}get-personal`, {
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
    await logout(navigate, notification);
  } else {
    notification.add('Server could not handle the request!', { variant: 'error' });
  }
  return data;
};

export const markUnsuccessful = async (notification, navigator, imageOne, imageTwo, information, dependency) => {
  const combinedData = new FormData();
  combinedData.append('info', JSON.stringify(information));
  combinedData.append('image1', imageOne);
  combinedData.append('image2', imageTwo);
  const response = await fetch(`${url}unsuccessful`, {
    method: 'POST',
    credentials: 'include',
    body: combinedData,
  });
  if (response.status === 200) {
    notification.add('Updated successfully!', { variant: 'success' });
    dependency(true);
  } else if (response.status === 401) {
    notification.add('Session is already over!', { variant: 'info' });
    await logout(navigator, notification);
  } else {
    const message = await response.json();
    notification.add(message, { variant: 'error' });
  }
};

export const getVisitInfo = async (notification, navigator, visitId) => {
  let data = [];
  const response = await fetch(`${url}filter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ filter: { _id: visitId } }),
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
