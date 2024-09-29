import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import moment from 'moment';
import { TableRow, Checkbox, TableCell, Typography, MenuItem, Button } from '@mui/material';
// utils
import Iconify from '../../../components/Iconify';
import ElapsedTimeTimer from '../visits/ElapsedTimeTimer';
import { fDateTime } from '../../../utils/formatTime';
import NotesModal from './NotesModal';
import { deleteVisitImage } from './scripts/visit-scripts';
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

const downloadImages = async (path) => {
  window.open(`https://drive.google.com/u/1/uc?id=${path}&export=download`, '_blank');
  return true;
};

export default function VisitTableRow({ row, selected, onEditRow }) {
  const { client, status, timeStart, duration, location, imagePaths, notes, agentId } = row;

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notification = { add: enqueueSnackbar, close: closeSnackbar };
  const navigator = useNavigate();

  return (
    <TableRow hover selected={false}>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {client.company_name}
        </Typography>
      </TableCell>
      <TableCell align="left">{timeStart ? fDateTime(timeStart) : fDateTime(new Date())}</TableCell>

      <TableCell align="left">
        {duration ? getFormattedDuration(duration) : <ElapsedTimeTimer startDate={timeStart} />}
      </TableCell>
      <TableCell align="left">
        <Typography>{`${agentId.name} ${agentId.surname}`}</Typography>
      </TableCell>
      <TableCell align="left">
        <Button
          variant="contained"
          onClick={() => {
            window.open(location, '_blank');
          }}
        >
          <Iconify icon={'eva:map-fill'} style={{ marginRight: '5px' }} />
          Location
        </Button>
      </TableCell>
      <TableCell align="left">{status}</TableCell>
      <TableCell align="left">
        {imagePaths.length > 0 &&
          imagePaths.map((path, index) => {
            return path ? (
              <Button
                key={index}
                sx={{ height: 30, minWidth: 50, mr: 1 }}
                variant="contained"
                onClick={() => {
                  downloadImages(path).then((data) => {
                    setTimeout(() => {
                      deleteVisitImage(notification, navigator, row, path, onEditRow);
                    }, 30000);
                  });
                }}
              >
                <Iconify icon={'eva:download-fill'} />
              </Button>
            ) : (
              <Typography key={index}>No images</Typography>
            );
          })}
        {imagePaths.length === 0 && <Typography>No images</Typography>}
      </TableCell>
      <TableCell align="left">
        <NotesModal notes={notes} />
      </TableCell>
      <TableCell />
    </TableRow>
  );
}
