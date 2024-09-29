import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { editUser } from '../scripts';

// ----------------------------------------------------------------------

ClientTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function ClientTableRow({ row, selected, onEditRow, onSelectRow, updateList }) {
  const theme = useTheme();

  const { name, surname, role, status, _id, email, phone } = row;

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notification = { add: enqueueSnackbar, close: closeSnackbar };

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          {`${name} ${surname}`}
        </Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {(() => {
          switch (role) {
            case 'retail_agent':
              return 'Retail Agent';
            case 'horeca_agent':
              return 'Horeca Agent';
            default:
              return role;
          }
        })()}
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {email}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {phone}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(status === 'banned' && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {status}
        </Label>
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              {status === 'active' ? (
                <MenuItem
                  onClick={() => {
                    editUser(notification, _id, { status: 'banned' });
                    updateList(true);
                    handleCloseMenu();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon={'eva:slash-outline'} />
                  Ban
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={() => {
                    editUser(notification, _id, { status: 'active' });
                    updateList(true);
                    handleCloseMenu();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon={'eva:cloud-upload-outline'} />
                  Activate
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
