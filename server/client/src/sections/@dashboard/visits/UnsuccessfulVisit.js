import React, { useState } from 'react';
import { Box, InputLabel, Typography, Modal, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression'; // Import the library

import { usePhotoGallery } from '../../../hooks/usePhotoGallery';
import Iconify from '../../../components/Iconify';
import { markUnsuccessful } from './scripts/visit-scripts';

function UnsuccessfulVisit({ visitId, open, handleClose, dependency }) {
  const [imageOne, setImageOne] = useState(null);
  const [imageTwo, setImageTwo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({
    notes: '',
    visitId,
  });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notification = { add: enqueueSnackbar, close: closeSnackbar };
  const navigator = useNavigate();
  const { takePhoto } = usePhotoGallery();

  // Compression options
  const compressionOptions = {
    maxSizeMB: 1, // Maximum file size in MB
    useWebWorker: true, // Use web worker for better performance
  };

  const compressImage = async (imageFile) => {
    try {
      const compressedFile = await imageCompression(imageFile, compressionOptions);
      return compressedFile;
    } catch (error) {
      console.error('Image compression failed:', error);
      return imageFile; // Return the original file if compression fails
    }
  };

  const handleChangeImageOne = async (event) => {
    const file = event.target.files[0];
    const compressedFile = await compressImage(file);
    setImageOne(compressedFile);
  };

  const handleChangeImageTwo = async (event) => {
    const file = event.target.files[0];
    const compressedFile = await compressImage(file);
    setImageTwo(compressedFile);
  };

  const handleChangeNotes = (event) => {
    const newValue = { ...info, notes: event.target.value };
    setInfo(newValue);
  };

  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const contentStyle = {
    width: '500px',
    height: '370px',
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '20px',
  };

  const inputStyle = {
    height: '40px',
    background: 'whitesmoke',
    width: '100%',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  };

  const buttonStyle = {
    width: '90%',
    height: '50px',
    backgroundColor: 'green',
    color: 'white',
    marginLeft: '5%',
  };

  return (
    <Modal
      open={open}
      onClose={!loading ? handleClose : () => console.log("Can't escape")}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={modalStyle}
    >
      <Box style={contentStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Visit details
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2, marginBottom: '10px' }}>
          Please provide the details of this finished visit.
        </Typography>
        <InputLabel
          htmlFor="imageOne"
          style={inputStyle}
          onClick={() => {
            takePhoto().then(async (file) => {
              const compressedFile = await compressImage(file);
              setImageOne(compressedFile);
            });
          }}
        >
          <Iconify icon={'eva:image-outline'} style={{ height: '50%', width: '10%' }} />
          {imageOne ? imageOne.name : 'First image'}
        </InputLabel>
        <InputLabel
          htmlFor="imageTwo"
          style={inputStyle}
          onClick={() => {
            takePhoto().then(async (file) => {
              const compressedFile = await compressImage(file);
              setImageTwo(compressedFile);
            });
          }}
        >
          <Iconify icon={'eva:image-outline'} style={{ height: '50%', width: '10%' }} />
          {imageTwo ? imageTwo.name : 'Second image'}
        </InputLabel>
        <TextField
          id="filled-multiline-flexible"
          label="Notes"
          variant="filled"
          fullWidth
          multiline
          maxRows={4}
          style={{ margin: '20px 0' }}
          onChange={handleChangeNotes}
        />
        <LoadingButton
          loading={loading}
          style={buttonStyle}
          onClick={() => {
            setLoading(true);
            markUnsuccessful(notification, navigator, imageOne, imageTwo, info, (booleanValue) => {
              dependency(booleanValue);
              handleClose();
            });
          }}
        >
          {loading ? '' : 'Confirm'}
        </LoadingButton>
      </Box>
    </Modal>
  );
}

export default UnsuccessfulVisit;
