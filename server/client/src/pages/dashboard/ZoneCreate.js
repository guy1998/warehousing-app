import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import { CircularProgress, Container } from '@mui/material';

// redux
import { getZones } from '../../redux/slices/zone';
import { useDispatch, useSelector } from '../../redux/store';

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
import ZoneNewEditForm from '../../sections/@dashboard/client/ZoneNewEditForm';
import { getZoneInfo } from '../../sections/@dashboard/client/scripts';

// ----------------------------------------------------------------------

export default function ZoneCreate() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const { name } = useParams();

  const { zones } = useSelector((state) => state.zone);

  const isEdit = pathname.includes('edit');

  const currentZone = zones.find((zone) => paramCase(zone.zone) === name);

  useEffect(() => {
    dispatch(getZones());
  }, [dispatch]);

  return (
    <Page title="Create a new county">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new county' : 'Edit county'}
          links={[{ name: 'County', href: PATH_DASHBOARD.client.zoneList }, { name: !isEdit ? 'New county' : name }]}
        />

        <ZoneNewEditForm isEdit={isEdit} currentZone={currentZone} />
      </Container>
    </Page>
  );
}
