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

ZoneNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentZone: PropTypes.object,
};

export default function ZoneNewEditForm({ isEdit, currentZone }) {
  const navigate = useNavigate();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const NewZoneSchema = Yup.object().shape({
    zone: Yup.string().required('Name is required'),
    // count: Yup.number().required('Product count is required'),
  });

  const defaultValues = useMemo(
    () => ({
      zone: currentZone?.zone || '',
      count: currentZone?.count || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentZone]
  );

  const methods = useForm({
    resolver: yupResolver(NewZoneSchema),
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
    if (isEdit && currentZone) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentZone]);

  const onSubmit = async () => {
    const raw = isEdit
      ? JSON.stringify({
          oldZone: currentZone.zone,
          newZone: getValues('zone'),
        })
      : JSON.stringify({
          newZone: getValues('zone'),
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
          ? `${process.env.REACT_APP_BACKEND_URL}/client/editZone`
          : `${process.env.REACT_APP_BACKEND_URL}/client/zone`,
        requestOptions
      )
        .then(async (res) => {
          if (res.ok) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            reset();
            enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
            navigate(PATH_DASHBOARD.client.zoneList);
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
    navigate(PATH_DASHBOARD.client.zoneList);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField
                name="zone"
                label="County Name"
                value={getValues('zone')}
                onChange={(event) => setValue('zone', event.target.value)}
              />

              <RHFTextField
                name="count"
                label="Client Count"
                value={getValues('count') ? getValues('count') : 0}
                onChange={(event) => setValue('count', Number(event.target.value))}
                sx={{ marginY: 1 }}
                InputProps={{
                  type: 'number',
                }}
                disabled
              />
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                {!isEdit ? 'Create Zone' : 'Save Changes'}
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
