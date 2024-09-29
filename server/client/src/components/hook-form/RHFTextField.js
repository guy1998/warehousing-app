import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFTextField.propTypes = {
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool, // Add the disabled prop type
};

RHFTextField.defaultProps = {
  disabled: false, // Set the default value for the disabled prop
};

export default function RHFTextField({ name, disabled, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          error={!!error}
          helperText={error?.message}
          disabled={disabled} // Pass the disabled prop to TextField
          {...other}
        />
      )}
    />
  );
}
