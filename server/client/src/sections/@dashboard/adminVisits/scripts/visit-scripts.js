import { logout } from '../../../auth/login/scripts';

const url = `${process.env.REACT_APP_BACKEND_URL}/visit/`;

export const getVisits = async (notification, navigate, filter) => {
  let data = [];
  const response = await fetch(`${url}filter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ filter }),
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

export const deleteVisitImage = async (notification, navigate, visit, path, dependency) => {
  const response = await fetch(`${url}delete-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ visit, image: path }),
  });
  if (response.status === 200) {
    notification.add('Image was downloaded and erased!', { variant: 'info' });
    dependency(true);
  } else if (response.status === 401) {
    notification.add('Session is already over!', { variant: 'info' });
    await logout(navigate, notification);
  } else {
    notification.add('Server could not handle the request and images were not deleted!', { variant: 'error' });
  }
  return 'Done';
};
