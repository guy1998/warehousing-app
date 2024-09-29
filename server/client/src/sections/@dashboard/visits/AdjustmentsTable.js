import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { NumericFormat } from 'react-number-format';
import TextField from '@mui/material/TextField';
import { TableRow, Checkbox, TableCell, Typography, MenuItem, Button, IconButton, Icon, Select } from '@mui/material';
import { Unstable_NumberInput as BaseNumberInput, numberInputClasses } from '@mui/base/Unstable_NumberInput';
import { styled } from '@mui/system';
// utils
import Iconify from '../../../components/Iconify';
import { fCurrency } from '../../../utils/formatNumber';

import { RHFSelect } from '../../../components/hook-form';

const CustomNumberInput = React.forwardRef((props, ref) => {
  return (
    <BaseNumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInputElement,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotprops={{
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

export default function SoldProductTable({ row, selected, onEditRow, onDeleteRow, index }) {
  const { productName, quantity, unit, maxQuantity, stockAlert } = row;
  const [soldQuantity, setSoldQuantity] = useState(0);
  const [type, setType] = useState('Addition');

  const [max, setMax] = useState(99999);

  const onChangeType = (event) => {
    const newType = event.target.value;
    onEditRow(row.realProduct, 'type', newType);
    setType(newType);
  };

  const onChangeQuantity = (event, val) => {
    if (val >= 0) {
      onEditRow(row.realProduct, 'quantity', val);
      setSoldQuantity(val);
    }
  };

  useEffect(() => {
    setSoldQuantity(quantity);
  }, [row]);

  useEffect(() => {
    if (type === 'Subtraction') {
      setMax(maxQuantity);
      if (soldQuantity > maxQuantity) {
        setSoldQuantity(maxQuantity);
      }
    } else {
      setMax(999999);
    }
  }, [type]);

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
          min={0}
          max={max}
          value={soldQuantity}
          onChange={onChangeQuantity}
          placeholder="Type a number…"
        />
      </TableCell>
      <TableCell align="left">
        <Select size="medium" name="category" value={type} onChange={onChangeType} required>
          <MenuItem value={'Addition'}>Addition</MenuItem>
          <MenuItem value={'Subtraction'}>Subtraction</MenuItem>
        </Select>
      </TableCell>
      <TableCell>{stockAlert}</TableCell>
      <TableCell>
        <Button variant="contained" color="error" onClick={() => onDeleteRow(row.realProduct)}>
          Remove
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
        color: #FFF;
        background: ${theme.palette.mode === 'dark' ? blue[600] : blue[500]};
        border-color: ${theme.palette.mode === 'dark' ? blue[400] : blue[600]};
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
      color: #FFF;
      background: ${theme.palette.mode === 'dark' ? blue[600] : blue[500]};
      border-color: ${theme.palette.mode === 'dark' ? blue[400] : blue[600]};
    }
  
    & .arrow {
      transform: translateY(-1px);
    }
  
    & .arrow {
      transform: translateY(-1px);
    }
  `
);
