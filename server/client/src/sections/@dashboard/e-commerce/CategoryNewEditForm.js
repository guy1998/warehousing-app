import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Chip, Grid, Stack, TextField, Typography, Autocomplete, InputAdornment } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadMultiFile,
  RHFTextFieldMultiLine,
} from '../../../components/hook-form';
import { logout } from '../../auth/login/scripts';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

CategoryNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCategory: PropTypes.object,
};

export default function CategoryNewEditForm({ isEdit, currentCategory }) {
  const navigate = useNavigate();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const NewCategorySchema = Yup.object().shape({
    category: Yup.string().required('Name is required'),
    // count: Yup.number().required('Product count is required'),
  });

  const defaultValues = useMemo(
    () => ({
      category: currentCategory?.category || '',
      count: currentCategory?.count || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCategory]
  );

  const methods = useForm({
    resolver: yupResolver(NewCategorySchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentCategory) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentCategory]);

  const onSubmit = async () => {
    const raw = isEdit
      ? JSON.stringify({
          oldCategory: currentCategory.category,
          newCategory: getValues('category'),
        })
      : JSON.stringify({
          category: getValues('category'),
        });

    const requestOptions = {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: raw,
      redirect: 'follow',
      credentials: 'include',
    };

    try {
      await fetch(
        isEdit
          ? `${process.env.REACT_APP_BACKEND_URL}/product/editCategory`
          : `${process.env.REACT_APP_BACKEND_URL}/product/categories`,
        requestOptions
      )
        .then(async (res) => {
          if (res.ok) {
            res.json();
            await new Promise((resolve) => setTimeout(resolve, 500));
            reset();
            enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
            navigate(PATH_DASHBOARD.eCommerce.categoryList);
          } else if (res.status === 401) {
            logout({ add: enqueueSnackbar, close: closeSnackbar }, navigate);
          }
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDiscard = () => {
    navigate(PATH_DASHBOARD.eCommerce.categoryList);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField
                name="category"
                label="Category Name"
                value={getValues('category')}
                onChange={(event) => setValue('category', event.target.value)}
              />

              <RHFTextField
                name="count"
                label="Product Count"
                value={getValues('count') ? getValues('count') : 0}
                onChange={(event) => setValue('count', Number(event.target.value))}
                sx={{ marginY: 1 }}
                InputProps={{
                  type: 'number',
                }}
                disabled
              />
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                {!isEdit ? 'Create Category' : 'Save Changes'}
              </LoadingButton>
              <LoadingButton type="reset" variant="outlined" size="large" onClick={handleDiscard}>
                Discard Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
