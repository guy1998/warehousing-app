import { logout } from '../../../auth/login/scripts';

const url = `${process.env.REACT_APP_BACKEND_URL}/sales/`;

export const createSale = async (notification, navigator, imageOne, imageTwo, visitId, notes, sale) => {
  const combinedData = new FormData();
  combinedData.append('info', JSON.stringify({ visitId, notes, sale }));
  combinedData.append('image1', imageOne);
  combinedData.append('image2', imageTwo);
  console.log(combinedData);
  const response = await fetch(`${url}add`, {
    method: 'POST',
    credentials: 'include',
    body: combinedData,
  });
  if (response.status === 200) {
    notification.add('Updated successfully!', { variant: 'success' });
    navigator('/agent/visit/list');
  } else if (response.status === 401) {
    notification.add('Session is already over!', { variant: 'info' });
    await logout(navigator, notification);
  } else {
    const message = await response.json();
    notification.add(message, { variant: 'error' });
  }
};

export const editSale = async (notification, navigator, saleId, newSoldProducts)=>{
  const response = await fetch(`${url}edit-sale`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ saleId, newSoldProducts }),
  });
  if (response.status === 200) {
    notification.add('Updated successfully!', { variant: 'success' });
    navigator('/admin/sale/list');
  } else if (response.status === 401) {
    notification.add('Session is already over!', { variant: 'info' });
    await logout(navigator, notification);
  } else {
    const message = await response.json();
    notification.add(message.message, { variant: 'error' });
  }
}

export const getSalesInformation = async (notification, navigator, saleId)=>{
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
}