import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState } from 'react';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

ResetPasswordForm.propTypes = {
  onSent: PropTypes.func,
  onGetEmail: PropTypes.func,
};

export default function ResetPasswordForm({ onSent, onGetEmail }) {
  const isMountedRef = useIsMountedRef();
  const [error, setError] = useState(false);

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: 'demo@minimals.cc' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (isMountedRef.current) {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
          }),
          redirect: 'follow',
        };

        await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/forgot-password`, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            const resultJSON = JSON.parse(result);
            if (resultJSON.status === 'Success') {
              onSent();
              onGetEmail(data.email);
              setError(false);
            } else {
              setError(true);
            }
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
        <RHFTextField name="email" label="Email address" />
        {error && (
          <Typography fontSize={'14px'} color="red">
            User with this email does not exist!
          </Typography>
        )}

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Reset Password
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
