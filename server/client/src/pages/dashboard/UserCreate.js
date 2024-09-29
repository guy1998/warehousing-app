import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import { CircularProgress, Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';
import { getUserInfo } from '../../sections/@dashboard/user/scripts';
import CreateUserForm from '../../sections/@dashboard/user/CreateUserForm';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const isEdit = pathname.includes('edit');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notification = { add: enqueueSnackbar, close: closeSnackbar };

  // const currentUser = _userList.find((user) => paramCase(user.name) === name);
  const [currentUser, setCurrentUser] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    phone: '',
    role: 'agent',
  });

  useEffect(()=>{
    if(isEdit){
      getUserInfo(notification, id).then(data=>{
        if(data)
          setCurrentUser(data);
      })
    }
  }, [])

  return (
    <Page title="User: Create a new user">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new user' : 'Edit user'}
          links={[
            { name: 'User', href: PATH_DASHBOARD.user.list },
            { name: !isEdit ? 'New user' : capitalCase(currentUser?.name) },
          ]}
        />

        {isEdit ? <UserNewEditForm isEdit={isEdit} currentUser={currentUser} /> : <CreateUserForm />}
      </Container>
    </Page>
  );
}
