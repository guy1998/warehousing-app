import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Iconify from '../../../components/Iconify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  height: 450,
  borderRadius: '15px',
  bgcolor: 'white',
  boxShadow: 24,
  p: 4,
};

function NotesModal({ notes }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  return (
    <div>
      <Button
        variant="outlined"
        onClick={
          notes
            ? handleOpen
            : () => {
                enqueueSnackbar('No notes for that visit!', { variant: 'info' });
              }
        }
      >
        <Iconify icon={'eva:file-text-fill'} style={{ marginRight: '5px' }} />
        <Typography noWrap variant="subtitle">
          See notes
        </Typography>
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotprops={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Visit notes
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              {notes}
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default NotesModal;
