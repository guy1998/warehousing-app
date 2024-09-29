import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSnackbar } from 'notistack';

// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Link, Alert, IconButton, InputAdornment, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// --------------------------------

export default function NewPasswordForm() {
  const { id, token } = useParams();

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const isMountedRef = useIsMountedRef();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(false);

  const NewPasswordSchema = Yup.object().shape({
    password: Yup.string().required('Password is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewPasswordSchema),
  });

  const {
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    if (getValues('password') !== getValues('confirmPassword')) {
      setError(true);
      return;
    }
    setError(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (isMountedRef.current) {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            password: getValues('password'),
          }),
          redirect: 'follow',
        };

        await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/reset-password/${id}/${token}`, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            const resultJSON = JSON.parse(result);
            if (resultJSON.status === 'Success') {
              setError(false);
              enqueueSnackbar('Password updated successfully!');
              navigate('/auth/login');
            } else {
              setError(true);
            }
            console.log(result);
          })
          .catch((error) => console.error(error));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <RHFTextField
          name="password"
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField
          name="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {error && (
          <Typography fontSize={'14px'} color="red">
            Passwords must match!
          </Typography>
        )}
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Reset Password
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
