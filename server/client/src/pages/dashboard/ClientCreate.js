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
import ClientNewEditForm from '../../sections/@dashboard/client/ClientNewEditForm';
import { getClientInfo } from '../../sections/@dashboard/client/scripts';

// ----------------------------------------------------------------------

export default function ClientCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id } = useParams();

  const isEdit = pathname.includes('edit');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notification = { add: enqueueSnackbar, close: closeSnackbar };

  // const currentUser = _userList.find((user) => paramCase(user.name) === name);
  const [currentClient, setCurrentClient] = useState({
    clientname: '',
    company_name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    type: 'DEFAULT',
    zone: 'DEFAULT',
  });

  useEffect(() => {
    if (isEdit) {
      getClientInfo(notification, id).then((data) => {
        if (data) setCurrentClient(data);
      });
    }
  }, []);

  return (
    <Page title="Client: Create a new client">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new client' : 'Edit client'}
          links={[
            { name: 'Client', href: PATH_DASHBOARD.client.list },
            { name: !isEdit ? 'New client' : capitalCase(currentClient?.company_name) },
          ]}
        />

        <ClientNewEditForm isEdit={isEdit} currentClient={currentClient} />
      </Container>
    </Page>
  );
}
