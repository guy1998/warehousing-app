const url = `${process.env.REACT_APP_BACKEND_URL}/auth/`;

export const login = async (email, password, navigator) => {
  if (email && password) {
    const response = await fetch(`${url}login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    if (response.status === 404) {
      throw new Error('User does not exist!');
    } else if (response.status === 400) {
      throw new Error('Incorrect password!');
    } else if (response.status === 401) {
      throw new Error('User has been banned!');
    } else if (response.status === 200) {
      const role = await response.json();
      let roleV2 = 'admin';

      if (role === 'horeca_agent' || role === 'retail_agent') roleV2 = 'agent';

      navigator(`/${roleV2}/app`);
    } else {
      throw new Error('Problem with the server!');
    }
  } else {
    throw new Error('Both email and password are required!');
  }
};

export const logout = async (notification, navigator) => {
  const response = await fetch(`${url}logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (response.status === 200) {
    notification.add('Logging out...', { variant: 'info' });
    navigator('/auth/login');
  }
};

export const authorize = async (navigator, pathname) => {
  const response = await fetch(`${url}authorize`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (response.status === 401) {
    if (!pathname.includes('/auth/login')) navigator('/auth/login');
  } else if (response.status === 200) {
    const role = await response.json();
    let roleV2 = 'admin';

    if (role === 'horeca_agent' || role === 'retail_agent') roleV2 = 'agent';
    if (pathname.includes('/auth/login') || !pathname.includes(roleV2)) navigator(`/${roleV2}/app`);
  }
};
