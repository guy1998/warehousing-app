import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { TableRow, Checkbox, TableCell, Typography, MenuItem, Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// utils
import Iconify from '../../../components/Iconify';
import { TableMoreMenu } from '../../../components/table';
import ElapsedTimeTimer from './ElapsedTimeTimer';
import { fDateTime } from '../../../utils/formatTime';
import UnsuccessfulVisit from './UnsuccessfulVisit';
import SaleCreation from './SaleCreation';

//

// ----------------------------------------------------------------------

VisitTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

const getFormattedDuration = (duration) => {
  const durationInMilliseconds = moment.duration(duration * 60 * 1000);
  return moment.utc(durationInMilliseconds.asMilliseconds()).format('HH:mm:ss');
};

export default function VisitTableRow({ row, selected, onEditRow, onDeleteRow }) {
  const { client, status, timeStart, duration, location, notes } = row;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [openMenu, setOpenMenuActions] = useState(null);
  const [openNegativeModal, setOpenNegativeModal] = useState(false);
  const [openPositiveModal, setOpenPositiveModal] = useState(false);
  const navigator = useNavigate();

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {client.company_name}
        </Typography>
      </TableCell>
      <TableCell align="left">{timeStart ? fDateTime(timeStart) : fDateTime(new Date())}</TableCell>
      {!row.duration ? (
        <TableCell align="left">
          {isMobile ? (
            <>
              <Button
                variant="contained"
                color="success"
                sx={{ color: 'white', width: '100%', fontSize: 13, mb: 1 }}
                onClick={() => {
                  navigator(`/agent/visit/${row._id}/sale`);
                }}
              >
                Sale
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ width: '100%', fontSize: 13 }}
                onClick={() => setOpenNegativeModal(true)}
              >
                No Sale
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="success"
                sx={{ color: 'white', width: 80, fontSize: 13 }}
                onClick={() => {
                  navigator(`/agent/visit/${row._id}/sale`);
                }}
              >
                Sale
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ ml: 1, width: 80, fontSize: 13 }}
                onClick={() => setOpenNegativeModal(true)}
              >
                No Sale
              </Button>
            </>
          )}
          {/* <TableMoreMenu
            open={openMenu}
            onOpen={handleOpenMenu}
            onClose={handleCloseMenu}
            actions={
              <>
                <MenuItem sx={{ color: 'error.main' }} onClick={() => setOpenNegativeModal(true)}>
                  <Iconify icon={'eva:close-square-outline'} />
                  No sale
                </MenuItem>
                <MenuItem
                  sx={{ color: 'success.main' }}
                  onClick={() => {
                    navigator(`/agent/visit/${row._id}/sale`);
                  }}
                >
                  <Iconify icon={'eva:pricetags-fill'} />
                  Sale
                </MenuItem>
              </>
            }
          /> */}
        </TableCell>
      ) : (
        <TableCell align="left">
          <Button variant="contained" color="info" disabled>
            Action Made
          </Button>
        </TableCell>
      )}
      <TableCell align="left">
        {duration ? getFormattedDuration(duration) : <ElapsedTimeTimer startDate={timeStart} />}
      </TableCell>
      <TableCell align="left">
        <Button
          variant="contained"
          color="info"
          onClick={() => {
            window.open(location, '_blank');
          }}
        >
          <Iconify icon={'eva:map-fill'} style={{ marginRight: '5px' }} />
          Location
        </Button>
      </TableCell>
      <TableCell align="left">{status}</TableCell>

      <UnsuccessfulVisit
        visitId={row._id}
        open={openNegativeModal}
        handleClose={() => setOpenNegativeModal(false)}
        dependency={onEditRow}
      />
    </TableRow>
  );
}
