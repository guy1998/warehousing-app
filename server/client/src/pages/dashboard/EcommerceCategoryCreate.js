import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getCategories } from '../../redux/slices/category';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import CategoryNewEditForm from '../../sections/@dashboard/e-commerce/CategoryNewEditForm';

// ----------------------------------------------------------------------

export default function EcommerceCategoryCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { categories } = useSelector((state) => state.category);
  const isEdit = pathname.includes('edit');
  const currentCategory = categories.find((category) => paramCase(category.category) === name);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <Page title="Create a new category">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new category' : 'Edit category'}
          links={[
            {
              name: 'Categories',
              href: PATH_DASHBOARD.eCommerce.list,
            },
            { name: !isEdit ? 'New category' : name },
          ]}
        />

        <CategoryNewEditForm isEdit={isEdit} currentCategory={currentCategory} />
      </Container>
    </Page>
  );
}
