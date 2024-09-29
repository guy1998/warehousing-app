import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getUnits } from '../../redux/slices/unit';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import UnitNewEditForm from '../../sections/@dashboard/e-commerce/UnitNewEditForm';

// ----------------------------------------------------------------------

export default function EcommerceUnitCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { units } = useSelector((state) => state.unit);
  const isEdit = pathname.includes('edit');
  const currentUnit = units.find((unit) => paramCase(unit) === name);

  useEffect(() => {
    dispatch(getUnits());
  }, [dispatch]);

  return (
    <Page title="Create a new unit">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new unit' : 'Edit unit'}
          links={[
            {
              name: 'Units',
              href: PATH_DASHBOARD.eCommerce.list,
            },
            { name: !isEdit ? 'New unit' : name },
          ]}
        />

        <UnitNewEditForm isEdit={isEdit} currentUnit={currentUnit} />
      </Container>
    </Page>
  );
}
