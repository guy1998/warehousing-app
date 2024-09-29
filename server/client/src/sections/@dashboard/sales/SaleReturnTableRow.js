import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { TableRow, Checkbox, TableCell, Typography, MenuItem, Button } from '@mui/material';
// utils
import { fDateTime } from '../../../utils/formatTime';
import { dispatchSale, confirmSale, markAsRecievied, markAsLost } from './scripts/sales-scripts';
import Iconify from '../../../components/Iconify';
import { TableMoreMenu } from '../../../components/table';
//

// ----------------------------------------------------------------------

SaleReturnTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  handleView: PropTypes.func,
};

export default function SaleReturnTableRow({ row, onEditRow, handleView }) {
  const { client, products, amount, status } = row;

  const [openMenu, setOpenMenuActions] = useState(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notification = { add: enqueueSnackbar, close: closeSnackbar };
  const navigator = useNavigate();
  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={false}>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {client?.company_name}
        </Typography>
      </TableCell>

      <TableCell align="left">{products.length}</TableCell>
      <TableCell align="left">${amount.$numberDecimal}</TableCell>
      <TableCell align="left">{status}</TableCell>
      <TableCell>
        <Button onClick={() => handleView(products)}>View products</Button>
      </TableCell>
      {status === 'pending' ? (
        <TableCell>
          <TableMoreMenu
            open={openMenu}
            onOpen={handleOpenMenu}
            onClose={handleCloseMenu}
            actions={
              <>
                <MenuItem
                  onClick={() => {
                    markAsRecievied(notification, navigator, row._id, onEditRow);
                    handleCloseMenu();
                  }}
                >
                  <Iconify sx={{ color: 'green' }} icon={'eva:inbox-fill'} />
                  Received
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    markAsLost(notification, navigator, row._id, onEditRow);
                    handleCloseMenu();
                  }}
                >
                  <Iconify sx={{ color: 'green' }} icon={'eva:slash-fill'} />
                  Lost
                </MenuItem>
              </>
            }
          />
        </TableCell>
      ) : (
        <TableCell />
      )}
    </TableRow>
  );
}
