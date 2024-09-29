import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import { changePassword } from '../scripts';
// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notification = { add: enqueueSnackbar, close: closeSnackbar };
  const [user, setUser] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })
  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is required'),
    newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  });

  const onChange = (dataField, newValue)=>{
    const newData = { ...user };
    newData[dataField] = newValue
    setUser({ ...newData })
    setValue(dataField, newValue);
  }

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    setValue,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    try {
      await changePassword(notification, user.newPassword, user.oldPassword, reset);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField name="oldPassword" type="password" label="Old Password" onChange={(event)=>onChange('oldPassword', event.target.value)}/>
          <RHFTextField name="newPassword" type="password" label="New Password" onChange={(event)=>onChange('newPassword', event.target.value)}/>
          <RHFTextField name="confirmNewPassword" type="password" label="Confirm New Password" onChange={(event)=>onChange('confirmNewPassword', event.target.value)}/>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save Changes
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
