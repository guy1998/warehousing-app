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

UnitNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUnit: PropTypes.string,
};

export default function UnitNewEditForm({ isEdit, currentUnit }) {
  const navigate = useNavigate();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const NewUnitSchema = Yup.object().shape({
    unit: Yup.string().required('Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      unit: currentUnit || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUnit]
  );

  const methods = useForm({
    resolver: yupResolver(NewUnitSchema),
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
    if (isEdit && currentUnit) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUnit]);

  const onSubmit = async () => {
    const raw = isEdit
      ? JSON.stringify({
          oldUnit: currentUnit,
          newUnit: getValues('unit'),
        })
      : JSON.stringify({
          unit: getValues('unit'),
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
          ? `${process.env.REACT_APP_BACKEND_URL}/product/editUnit`
          : `${process.env.REACT_APP_BACKEND_URL}/product/units`,
        requestOptions
      )
        .then(async (res) => {
          if (res.ok) {
            res.json();
            await new Promise((resolve) => setTimeout(resolve, 500));
            reset();
            enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
            navigate(PATH_DASHBOARD.eCommerce.unitList);
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
    navigate(PATH_DASHBOARD.eCommerce.unitList);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField
                name="unit"
                label="Unit Name"
                value={getValues('unit')}
                onChange={(event) => setValue('unit', event.target.value)}
              />

              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                {!isEdit ? 'Create Unit' : 'Save Changes'}
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
