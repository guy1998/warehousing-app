import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { fData } from '../../../../utils/formatNumber';
// _mock
import { countries } from '../../../../_mock';
// components
import { FormProvider, RHFSwitch, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';
import { getOwnInformation, editOwnInformation } from '../scripts';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notification = { add:enqueueSnackbar, close: closeSnackbar }
  const [user, setUser] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
  });
  
  const onChange = (dataField, newValue)=>{
    const newData= {...user};
    newData[dataField] = newValue;
    setUser(newData);
    setValue(dataField, newValue)
  }

  const setFormValue = (data)=>{
    setValue('name', data.name);
    setValue('surname', data.surname);
    setValue('email', data.email);
    setValue('phone', data.phone);
  }

  useEffect(()=>{
    getOwnInformation(notification).then(data=>{
      setUser(data)
      setFormValue(data)
    })
  }, [])

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    surname: Yup.string().required('Surname is required'),
    email: Yup.string().required('Email is required'),
    phone: Yup.string().required('Phone number is required')
  });

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues: user,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    try {
      await editOwnInformation(notification, user)
    } catch (error) {
      console.error(error);
    }
  };

  // const handleDrop = useCallback(
  //   (acceptedFiles) => {
  //     const file = acceptedFiles[0];

  //     if (file) {
  //       setValue(
  //         'photoURL',
  //         Object.assign(file, {
  //           preview: URL.createObjectURL(file),
  //         })
  //       );
  //     }
  //   },
  //   [setValue]
  // );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {/* <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />

            <RHFSwitch name="isPublic" labelPlacement="start" label="Public Profile" sx={{ mt: 5 }} />
          </Card>
        </Grid> */}

        <Grid item xs={22} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <RHFTextField name="name" label="Name" onChange={(event)=>onChange('name', event.target.value)} value={user.name} sx = {{marginBottom: '15px'}}/>
              <RHFTextField name="surname" label="Surname" onChange={(event)=>onChange('surname', event.target.value)} value={user.surname} sx = {{marginBottom: '15px'}}/>
              <RHFTextField name="email" label="Email Address" onChange={(event)=>onChange('email', event.target.value)} value={user.email}sx = {{marginBottom: '15px'}}/>

              <RHFTextField name="phone" label="Phone Number" onChange={(event)=>onChange('phone', event.target.value)} value={user.phone}/>
              {/* <RHFTextField name="address" label="Address" />

              <RHFSelect name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((option) => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="state" label="State/Region" />

              <RHFTextField name="city" label="City" />
              <RHFTextField name="zipCode" label="Zip/Code" /> */}
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              {/* <RHFTextField name="about" multiline rows={4} label="About" /> */}

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
