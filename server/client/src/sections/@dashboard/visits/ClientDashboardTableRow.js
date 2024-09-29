import PropTypes from 'prop-types';
import { useState } from 'react';
import { TableRow, Checkbox, TableCell, Typography, MenuItem, Button } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
import Iconify from '../../../components/Iconify';
import { TableMoreMenu } from '../../../components/table';

//

// ----------------------------------------------------------------------

ClientDashboardTableRow.propTypes = {
  row: PropTypes.object,
};

function ClientDashboardTableRow({ row }) {
  const { company_name: companyName, zone, address } = row;

  return (
    <TableRow hover key={row._id}>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {companyName}
        </Typography>
      </TableCell>

      <TableCell align="left">{zone}</TableCell>
      <TableCell align="left">{address}</TableCell>
    </TableRow>
  );
}

export default ClientDashboardTableRow;
