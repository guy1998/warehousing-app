import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import TextField from '@mui/material/TextField';
import { NumericFormat } from 'react-number-format';
import Modal from '@mui/material/Modal';
import Input from '@mui/material/Input';
import { FormControl, InputLabel, Icon } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Autocomplete from '@mui/material/Autocomplete';
import imageCompression from 'browser-image-compression'; // Import the library

import Iconify from '../../../components/Iconify';
import { createSale } from './scripts/sales-scripts';
import { getAllProducts } from './scripts/product-scripts';

const filterProducts = (products) => {
  const filteredProducts = products.filter((product) => product.quantity > 0);
  const mapped = filteredProducts.map((product) => {
    return { ...product, label: product.productName };
  });
  return mapped;
};

const generateSale = (visit, quantity, price, product) => {
  return {
    client: visit.client,
    quantity,
    price,
    product: product._id,
    unit: product.unit,
  };
};

const NumericFormatCustom = React.forwardRef((props, ref) => {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix="$"
    />
  );
});

NumericFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

function SaleCreation({ visit, open, handleClose, dependency }) {
  const [imageOne, setImageOne] = useState(null);
  const [imageTwo, setImageTwo] = useState(null);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [notes, setNotes] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notification = { add: enqueueSnackbar, close: closeSnackbar };
  const navigator = useNavigate();

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
    setNotes(event.target.value);
  };

  const handleChangeProduct = (event, newValue) => {
    if (newValue) {
      setSelectedProduct(newValue);
      setPrice(newValue.productPrice.$numberDecimal);
    } else {
      setSelectedProduct(null);
      setPrice(0);
    }
  };

  const handleChangeQuantity = (event) => {
    const inputValue = parseInt(event.target.value, 10);
    if (event.target.value === '') setQuantity(0);
    else if (Number.isNaN(inputValue)) {
      notification.add('Enter a valid integer', { variant: 'error' });
      setQuantity(0);
    } else if (inputValue > selectedProduct.quantity) {
      notification.add(
        `There are only ${selectedProduct.quantity} ${selectedProduct.unit} of ${selectedProduct.productName} left!`,
        { variant: 'info' }
      );
      setQuantity(selectedProduct.quantity);
    } else {
      setQuantity(inputValue);
    }
  };

  const style = {
    width: '500px',
    height: '370px',
    padding: '7px 12px',
  };

  const mainFieldStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
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

  const containerStyle = {
    background: 'white',
    borderRadius: '15px',
    margin: 'auto auto',
    height: '450px',
    width: '1100px',
  };

  const buttonStyle = {
    width: '90%',
    height: '50px',
    backgroundColor: 'green',
    color: 'white',
    marginLeft: '5%',
  };

  useEffect(() => {
    getAllProducts(notification, navigator).then((data) => {
      if (data) setProducts(filterProducts(data));
    });
  }, []);

  return (
    <div>
      <Modal
        open={open}
        onClose={!loading ? handleClose : () => console.log("Can't escape")}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <Box sx={containerStyle}>
          <Box sx={mainFieldStyle}>
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Visit details
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2, marginBottom: '20px' }}>
                Please provide the details of this finished visit, 2 required images and optional notes.
              </Typography>
              <InputLabel htmlFor="imageOne" style={inputStyle}>
                <Iconify icon={'eva:image-outline'} style={{ height: '50%', width: '10%' }} />
                {imageOne ? imageOne.name : 'First image'}
              </InputLabel>
              <input
                id="imageOne"
                name="imageOne"
                type="file"
                style={{ display: 'none' }}
                onChange={handleChangeImageOne}
              />
              <InputLabel htmlFor="imageTwo" style={inputStyle}>
                <Iconify icon={'eva:image-outline'} style={{ height: '50%', width: '10%' }} />
                {imageTwo ? imageTwo.name : 'Second image'}
              </InputLabel>
              <input
                id="imageTwo"
                name="imageTwo"
                type="file"
                style={{ display: 'none' }}
                onChange={handleChangeImageTwo}
              />
              <TextField
                id="filled-multiline-flexible"
                label="Notes"
                variant="filled"
                fullWidth
                multiline
                maxRows={4}
                style={{ margin: '30px 0' }}
                onChange={handleChangeNotes}
              />
            </Box>
            <div style={{ height: '90%', width: '1px', backgroundColor: 'whitesmoke' }} />
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Sale details
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2, marginBottom: '10px' }}>
                Please provide details on the product and quantity you want to sell.
              </Typography>
              <Autocomplete
                disablePortal
                fullWidth
                value={selectedProduct}
                id="combo-box-demo"
                options={products}
                onChange={handleChangeProduct}
                renderInput={(params) => <TextField {...params} label="Product" />}
              />
              <TextField
                id="outlined-basic"
                disabled={!selectedProduct}
                label="Quantity"
                variant="outlined"
                value={quantity}
                onChange={handleChangeQuantity}
                fullWidth
                style={{ margin: '20px 0' }}
              />
              <TextField
                label="Price"
                value={price}
                disabled={!selectedProduct}
                onChange={(event) => setPrice(event.target.value)}
                name="numberformat"
                id="formatted-numberformat-input"
                InputProps={{
                  inputComponent: NumericFormatCustom,
                }}
                variant="outlined"
                fullWidth
              />
            </Box>
          </Box>
          <Box>
            <LoadingButton
              loading={loading}
              style={buttonStyle}
              onClick={() => {
                if (imageOne && imageTwo && quantity && price && selectedProduct) {
                  setLoading(true);
                  const newSale = generateSale(visit, quantity, price, selectedProduct);
                  createSale(notification, navigator, imageOne, imageTwo, visit._id, notes, newSale, (booleanValue) => {
                    dependency(booleanValue);
                    handleClose();
                  });
                } else {
                  notification.add('All fields are required except for notes!', { variant: 'error' });
                }
              }}
            >
              {loading ? '' : 'Confirm'}
            </LoadingButton>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default SaleCreation;
