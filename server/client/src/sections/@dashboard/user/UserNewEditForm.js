import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries } from '../../../_mock';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import { createUser, editUser } from './scripts';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ isEdit, currentUser }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({ ...currentUser });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notification = { add: enqueueSnackbar, close: closeSnackbar };
  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    surname: Yup.string().required('Surname is required'),
    email: Yup.string().required('Email is required').email(),
    phone: Yup.string().required('Phone number is required'),
    role: Yup.string().required('Role Number is required'),
  });

  const onChange = (dataField, newValue) => {
    const newData = { ...user };
    newData[dataField] = newValue;
    setUser({ ...newData });
    setValue(dataField, newValue);
  };

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues: user,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    setUser({ ...currentUser });
    reset(currentUser);
  }, [isEdit, currentUser]);

  const onSubmit = async () => {
    try {
      if (!isEdit) await createUser(notification, user, () => navigate('/admin/user/list'));
      else await editUser(notification, currentUser._id, user, () => navigate('/admin/user/list'));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <RHFTextField
                name="name"
                label="Name"
                onChange={(event) => onChange('name', event.target.value)}
                value={user.name || ''}
                sx={{ marginBottom: '15px' }}
              />
              <RHFTextField
                name="surname"
                label="Surname"
                onChange={(event) => onChange('surname', event.target.value)}
                value={user.surname || ''}
                sx={{ marginBottom: '15px' }}
              />
              <RHFTextField
                name="email"
                label="Email Address"
                onChange={(event) => onChange('email', event.target.value)}
                value={user.email || ''}
                sx={{ marginBottom: '15px' }}
              />
              {!isEdit && (
                <RHFTextField
                  name="password"
                  label="Password"
                  onChange={(event) => onChange('password', event.target.value)}
                  value={user.password || ''}
                  sx={{ marginBottom: '15px' }}
                />
              )}
              <RHFTextField
                name="phone"
                label="Phone Number"
                onChange={(event) => onChange('phone', event.target.value)}
                value={user.phone || ''}
                sx={{ marginBottom: '15px' }}
              />
              <RHFSelect value={user.role || 'retail_agent'} onChange={(event) => onChange('role', event.target.value)}>
                <option value={'retail_agent'}>Retail Agent</option>
                <option value={'horeca_agent'}>Horeca Agent</option>
                <option value={'admin'}>Admin</option>
              </RHFSelect>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
