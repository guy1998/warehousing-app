import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';

import Iconify from '../../../components/Iconify';
import { createVisit } from './scripts/visit-scripts';
import './styles/create-visit-modal.css';

function CreateVisitModal({ selectedClient }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notification = { add: enqueueSnackbar, close: closeSnackbar };
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');

  const getGeoLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
            resolve(url);
          },
          (error) => {
            console.error('Error getting location: ', error);
            reject(error);
          }
        );
      } else {
        alert(
          'Your browser currently does not support geolocation! To use this feature of the app you need to have a browser that supports geolocation'
        );
        reject(new Error('Geolocation not supported'));
      }
    });
  };

  return (
    <div>
      <Button
        style={{ background: 'green', color: 'white', margin: '15px 10px' }}
        onClick={() => {
          if (selectedClient) handleOpen();
          else notification.add('You must select a client first!', { variant: 'info' });
        }}
      >
        <Iconify icon={'eva:edit-fill'} style={{ marginRight: '5px' }} />
        Start Visit
      </Button>
      <Modal
        open={open}
        onClose={loading ? () => {} : handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ display: 'flex', alignItems: 'center', width: '100vw' }}
      >
        <Box className="modal-content">
          <Typography id="modal-modal-title" variant="h4" component="h2">
            Confirm visit
          </Typography>
          {/* <hr style={{ width: '93%', color: 'whitesmoke' }} /> */}
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to create a visit at the following client:
          </Typography>
          <ul style={{ marginTop: '17px', listStyleType: 'none' }}>
            <li>
              <b>Comapny name:</b> {selectedClient?.company_name}
            </li>
            <li>
              <b>Address:</b> {selectedClient?.address}
            </li>
            <li>
              <b>County:</b> {selectedClient?.zone}
            </li>
          </ul>
          <div style={{ justifyContent: loading ? 'center' : 'space-between' }} className="buttonDiv">
            {!loading && (
              <>
                <Button
                  variant="contained"
                  color="error"
                  style={{ color: 'white', width: '200px' }}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ width: '200px', color: 'white' }}
                  onClick={() => {
                    setLoading(true);
                    getGeoLocation()
                      .then((url) => {
                        const visit = {
                          client: selectedClient?._id,
                          address: selectedClient?.address,
                          location: url,
                          agentId: '',
                        };
                        createVisit(notification, navigate, visit, handleClose);
                      })
                      .catch((err) => {
                        notification.add('You must allow the application to know your location!', { variant: 'error' });
                        setLoading(false);
                      });
                  }}
                >
                  Confirm
                </Button>{' '}
              </>
            )}
            {loading && <CircularProgress color="success" />}
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default CreateVisitModal;
