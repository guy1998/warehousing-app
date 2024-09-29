import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { NumericFormat } from 'react-number-format';
import TextField from '@mui/material/TextField';
import { TableRow, Checkbox, TableCell, Typography, MenuItem, Button, IconButton, Icon } from '@mui/material';
import { Unstable_NumberInput as BaseNumberInput, numberInputClasses } from '@mui/base/Unstable_NumberInput';
import { styled } from '@mui/system';
// utils
import Iconify from '../../../components/Iconify';
import { fCurrency } from '../../../utils/formatNumber';

const CustomNumberInput = React.forwardRef((props, ref) => {
  return (
    <BaseNumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInputElement,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        incrementButton: {
          children: '▴',
        },
        decrementButton: {
          children: '▾',
        },
      }}
      {...props}
      ref={ref}
    />
  );
});
//

// ----------------------------------------------------------------------

const NumericFormatCustom = React.forwardRef((props, ref) => {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix="$"
    />
  );
});

NumericFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

SoldProductTable.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function SoldProductTable({ row, selected, onEditRow, onDeleteRow, index, userRole }) {
  const { productName, quantity, soldPrice, unit, maxQuantity } = row;
  const [sellingPrice, setSellingPrice] = useState(soldPrice);
  const [soldQuantity, setSoldQuantity] = useState(1);

  const onChangeQuantity = (event, val) => {
    if (val > 0 && val <= maxQuantity) {
      onEditRow(row.realProduct, 'quantity', val);
      setSoldQuantity(val);
    }
  };

  useEffect(() => {
    setSellingPrice(soldPrice);
    setSoldQuantity(quantity);
  }, [row]);

  return (
    <TableRow hover key={index} selected={selected}>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {productName}
        </Typography>
      </TableCell>
      <TableCell>{unit}</TableCell>
      <TableCell>{maxQuantity}</TableCell>
      <TableCell align="left">
        <CustomNumberInput
          aria-label="Demo number input"
          min={1}
          max={maxQuantity}
          value={soldQuantity}
          onChange={onChangeQuantity}
          placeholder="Type a number…"
        />
      </TableCell>
      <TableCell align="left">
        <TextField
          label="Price"
          value={sellingPrice}
          disabled={false}
          onChange={(event) => {
            onEditRow(row.realProduct, 'soldPrice', event.target.value);
            setSellingPrice(event.target.value);
          }}
          name="numberformat"
          id={index}
          InputProps={{
            inputComponent: NumericFormatCustom,
          }}
          variant="outlined"
          sx={{ minWidth: '100px' }}
          fullWidth
        />
      </TableCell>
      <TableCell>{fCurrency(soldQuantity * sellingPrice)}</TableCell>
      <TableCell>
        <Button onClick={() => onDeleteRow(row.realProduct)}>
          <Iconify icon={'eva:close-fill'} color="red" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

const blue = {
  100: '#DAECFF',
  200: '#80BFFF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const StyledInputRoot = styled('div')(
  ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 400;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 4px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'};
    display: grid;
    grid-template-columns: 1fr 19px;
    grid-template-rows: 1fr 1fr;
    overflow: hidden;
    column-gap: 8px;
    padding: 4px;
  
    &.${numberInputClasses.focused} {
      border: 2px solid green;
    }
  
    &:hover {
      border-color: green;
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

const StyledInputElement = styled('input')(
  ({ theme }) => `
    font-size: 0.875rem;
    font-family: inherit;
    font-weight: 400;
    line-height: 1.5;
    grid-column: 1/2;
    grid-row: 1/3;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: inherit;
    border: none;
    border-radius: inherit;
    padding: 8px 12px;
    outline: 0;
  `
);

const StyledButton = styled('button')(
  ({ theme }) => `
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    appearance: none;
    padding: 0;
    width: 19px;
    height: 19px;
    font-family: system-ui, sans-serif;
    font-size: 0.875rem;
    line-height: 1;
    box-sizing: border-box;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 0;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  
    &:hover {
      background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
      cursor: pointer;
    }
  
    &.${numberInputClasses.incrementButton} {
      grid-column: 2/3;
      grid-row: 1/2;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      border: 1px solid;
      border-bottom: 0;
      border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
      color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
  
      &:hover {
        cursor: pointer;
        color: white;
        background: ${theme.palette.mode === 'dark' ? blue[600] : 'green'};
        border-color: ${theme.palette.mode === 'dark' ? blue[400] : 'green'};
      }
    }
  
    &.${numberInputClasses.decrementButton} {
      grid-column: 2/3;
      grid-row: 2/3;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      border: 1px solid;
      border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
      color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
    }
  
    &:hover {
      cursor: pointer;
      color: white;
      background: ${theme.palette.mode === 'dark' ? blue[600] : 'green'};
      border-color: ${theme.palette.mode === 'dark' ? blue[400] : 'green'};
    }
  
    & .arrow {
      transform: translateY(-1px);
    }
  
    & .arrow {
      transform: translateY(-1px);
    }
  `
);
