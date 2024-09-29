import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFTextFieldMultiLine.propTypes = {
  name: PropTypes.string,
};

export default function RHFTextFieldMultiLine({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField {...field} multiline fullWidth error={!!error} helperText={error?.message} {...other} />
      )}
    />
  );
}
