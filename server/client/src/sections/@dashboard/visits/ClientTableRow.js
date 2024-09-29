import PropTypes from 'prop-types';
import { useState } from 'react';
import { TableRow, Checkbox, TableCell, Typography, MenuItem, Button } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
import Iconify from '../../../components/Iconify';
import { TableMoreMenu } from '../../../components/table';
import CreateVisitModal from './CreateVisitModal';
//

// ----------------------------------------------------------------------

ClientTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

function ClientTableRow({ row, selected, uponSelect }) {
  const { company_name: companyName, zone, address } = row;

  return (
    <TableRow hover selected={selected} key={row._id}>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {companyName}
        </Typography>
      </TableCell>

      <TableCell align="left">{zone}</TableCell>
      <TableCell align="left">{address}</TableCell>

      <TableCell align="center">
        <CreateVisitModal selectedClient={row} />
      </TableCell>
    </TableRow>
  );
}

export default ClientTableRow;
