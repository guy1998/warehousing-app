import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel } from '@mui/material';

import { PATH_DASHBOARD } from '../../../routes/paths';

import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import { createClient, editClient, getAllZones } from './scripts';

// ----------------------------------------------------------------------

export default function ClientNewEditForm({ isEdit, currentClient }) {
  const navigate = useNavigate();

  const [zones, setZones] = useState([]);
  const [client, setClient] = useState({ ...currentClient });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notification = { add: enqueueSnackbar, close: closeSnackbar };

  const NewClientSchema = Yup.object().shape({
    clientname: Yup.string().required('Client Name is required'),
    company_name: Yup.string().required('Company Name is required'),
    email: Yup.string().required('Email is required').email(),
    phone: Yup.string().required('Phone number is required'),
    city: Yup.string().required('City is required'),
    address: Yup.string().required('Address is required'),
    type: Yup.string().required('Type is required'),
    zone: Yup.string().required('County is required'),
  });

  const onChange = (dataField, newValue) => {
    const newData = { ...client };
    newData[dataField] = newValue;
    setClient({ ...newData });
    setValue(dataField, newValue);
  };

  const methods = useForm({
    resolver: yupResolver(NewClientSchema),
    defaultValues: client,
  });

  const {
    reset,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    setClient({ ...currentClient });
    reset(currentClient);
  }, [isEdit, currentClient]);

  useEffect(() => {
    getAllZones(notification).then((data) => {
      if (data) {
        setZones(data);
      }
    });
  }, []);

  const onSubmit = async () => {
    try {
      if (!isEdit) await createClient(notification, client, () => navigate('/admin/client/list'));
      else await editClient(notification, currentClient._id, client, () => navigate('/admin/client/list'));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDiscard = () => {
    navigate(PATH_DASHBOARD.client.list);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <RHFTextField
                  name="clientname"
                  label="Client Name"
                  onChange={(event) => onChange('clientname', event.target.value)}
                  value={client.clientname || ''}
                  sx={{ marginBottom: '15px' }}
                />
                <RHFTextField
                  name="company_name"
                  label="Company Name"
                  onChange={(event) => onChange('company_name', event.target.value)}
                  value={client.company_name || ''}
                  sx={{ marginBottom: '15px' }}
                />
                <RHFTextField
                  name="email"
                  label="Email Address"
                  onChange={(event) => onChange('email', event.target.value)}
                  value={client.email || ''}
                  sx={{ marginBottom: '15px' }}
                />

                <RHFTextField
                  name="phone"
                  label="Phone Number"
                  onChange={(event) => onChange('phone', event.target.value)}
                  value={client.phone || ''}
                  sx={{ marginBottom: '15px' }}
                />
                <RHFTextField
                  name="city"
                  label="City"
                  onChange={(event) => onChange('city', event.target.value)}
                  value={client.city || ''}
                  sx={{ marginBottom: '15px' }}
                />
                <RHFTextField
                  name="address"
                  label="Address"
                  onChange={(event) => onChange('address', event.target.value)}
                  value={client.address || ''}
                  sx={{ marginBottom: '15px' }}
                />

                <RHFSelect
                  name="type"
                  value={client.type || 'DEFAULT'}
                  onChange={(event) => onChange('type', event.target.value)}
                  sx={{ marginBottom: '15px' }}
                >
                  <option disabled value="DEFAULT">
                    Select a Type
                  </option>
                  <option value={'horeca'}>Horeca</option>
                  <option value={'retail'}>Retail</option>
                </RHFSelect>
                <RHFSelect
                  name="zone"
                  value={client.zone || 'DEFAULT'}
                  onChange={(event) => onChange('zone', event.target.value)}
                >
                  <option disabled value="DEFAULT">
                    Select a County
                  </option>
                  {zones.map((zone) => (
                    <option key={zone.zone} value={zone.zone}>
                      {zone.zone}
                    </option>
                  ))}
                </RHFSelect>
              </Box>

              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                {!isEdit ? 'Create Client' : 'Save Changes'}
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
