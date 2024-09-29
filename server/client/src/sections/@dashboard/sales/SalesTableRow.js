import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { TableRow, Checkbox, TableCell, Typography, MenuItem, Button } from '@mui/material';
// utils
import { fDateTime } from '../../../utils/formatTime';
import { dispatchSale, confirmSale } from './scripts/sales-scripts';
import Iconify from '../../../components/Iconify';
import { TableMoreMenu } from '../../../components/table';
import { getOwnInformation } from '../user/scripts';

//

// ----------------------------------------------------------------------

SalesTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  handleView: PropTypes.func,
};

export default function SalesTableRow({ row, isAdmin, onEditRow, handleView }) {
  const { client, soldProducts, status, date, saleReturn, agent } = row;

  const [user, setUser] = useState(null);
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

  const calculateAmount = (soldProducts) => {
    if (user && user.role !== 'admin') {
      return soldProducts
        .reduce((acc, product) => {
          if (product.soldPrice)
            return parseFloat(acc) + parseFloat(product.soldPrice.$numberDecimal) * parseFloat(product.quantity);
          return user?.role === 'horeca_agent'
            ? parseFloat(acc) + parseFloat(product.priceHoreca.$numberDecimal) * parseFloat(product.quantity)
            : parseFloat(acc) + parseFloat(product.priceRetail.$numberDecimal) * parseFloat(product.quantity);
        }, 0)
        .toFixed(2);
    }
    if (client) {
      return soldProducts
        .reduce((acc, product) => {
          if (product.soldPrice)
            return parseFloat(acc) + parseFloat(product.soldPrice.$numberDecimal) * parseFloat(product.quantity);
          return client.type === 'horeca'
            ? parseFloat(acc) + parseFloat(product.priceHoreca.$numberDecimal) * parseFloat(product.quantity)
            : parseFloat(acc) + parseFloat(product.priceRetail.$numberDecimal) * parseFloat(product.quantity);
        }, 0)
        .toFixed(2);
    }
  };

  useEffect(() => {
    getOwnInformation(notification).then((data) => {
      if (data) setUser(data);
    });
  }, []);

  return (
    <TableRow hover selected={false}>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {client.company_name}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography>{client.type}</Typography>
      </TableCell>
      <TableCell align="left">{date ? fDateTime(date) : fDateTime(new Date())}</TableCell>
      <TableCell align="left">
        <Typography>{`${agent?.name} ${agent?.surname}`}</Typography>
      </TableCell>
      <TableCell align="left">{soldProducts.length}</TableCell>
      <TableCell align="left">${calculateAmount(soldProducts)}</TableCell>
      <TableCell align="left">{status}</TableCell>
      <TableCell>
        <Button onClick={() => handleView(soldProducts, client.type)}>View products</Button>
      </TableCell>
      {isAdmin && (status === 'pending' || status === 'dispatched') ? (
        <TableCell>
          <TableMoreMenu
            open={openMenu}
            onOpen={handleOpenMenu}
            onClose={handleCloseMenu}
            actions={
              <>
                {status !== 'dispatched' ? (
                  <MenuItem
                    onClick={() => {
                      dispatchSale(notification, navigator, row._id, onEditRow);
                      handleCloseMenu();
                    }}
                  >
                    <Iconify sx={{ color: 'green' }} icon={'eva:car-outline'} />
                    Dispatch
                  </MenuItem>
                ) : (
                  <></>
                )}
                <MenuItem
                  onClick={() => {
                    confirmSale(notification, navigator, row._id, onEditRow);
                    handleCloseMenu();
                  }}
                >
                  <Iconify sx={{ color: 'green' }} icon={'eva:checkmark-circle-2-fill'} />
                  Confirm
                </MenuItem>
                <MenuItem onClick={()=>{
                  navigator(`/admin/sales/${row._id}/edit`)
                }}>
                  <Iconify sx={{ color: 'green' }} icon={'eva:edit-fill'} />
                  Edit
                </MenuItem>
                {!saleReturn ? (
                  <MenuItem
                    onClick={() => {
                      navigator(`/admin/sales/${row._id}/return`);
                    }}
                  >
                    <Iconify sx={{ color: 'green' }} icon={'eva:archive-fill'} />
                    Sale return
                  </MenuItem>
                ) : (
                  <></>
                )}
              </>
            }
          />
        </TableCell>
      ) : (
        <></>
      )}
    </TableRow>
  );
}
