import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

ClientTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterZone: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterZone: PropTypes.func,
  optionsZone: PropTypes.arrayOf(
    PropTypes.shape({
      zone: PropTypes.string,
      count: PropTypes.number,
    })
  ),
};

export default function ClientTableToolbar({ filterName, filterZone, onFilterName, onFilterZone, optionsZone }) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        select
        label="County"
        value={filterZone}
        onChange={onFilterZone}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        <MenuItem
          key={'all'}
          value={'all'}
          sx={{
            mx: 1,
            my: 0.5,
            borderRadius: 0.75,
            typography: 'body2',
            textTransform: 'capitalize',
          }}
          selected
        >
          all
        </MenuItem>
        {optionsZone.map((option, index) => (
          <MenuItem
            key={index}
            value={option.zone}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option.zone}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Search client..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
