import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Chip, Grid, Stack, Typography, InputAdornment } from '@mui/material';

import { getAllCategories, getAllUnits } from '../product/scripts';
import { logout } from '../../auth/login/scripts';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFRadioGroup,
  RHFTextFieldMultiLine,
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

const UNIT_OPTION = ['KG', 'Piece', 'Liter'];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ProductNewEditForm({ isEdit, currentProduct }) {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [priceError, setPriceError] = useState();
  const [categoryError, setCategoryError] = useState();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const notification = { add: enqueueSnackbar, close: closeSnackbar };

  const NewProductSchema = Yup.object().shape({
    productName: Yup.string().required('Name is required'),
    code: Yup.string().required('Code is required'),
    category: Yup.string().required('Category is required'),
    brand: Yup.string().required('Brand is required'),
    unit: Yup.string().required('Unit is required'),
    quantity: Yup.number().moreThan(-1, 'Quantity should not be less than 0'),
    stockAlertQuantity: Yup.number().moreThan(-1, 'Stock alert quantity should not less 0'),
  });

  const defaultValues = useMemo(
    () => ({
      productName: currentProduct?.productName || '',
      code: currentProduct?.code || '',
      category: currentProduct?.category || 'DEFAULT',
      brand: currentProduct?.brand || '',
      unit: currentProduct?.unit || UNIT_OPTION[0],
      quantity: currentProduct?.quantity || 0,
      priceHoreca: currentProduct?.priceHoreca || 0,
      priceRetail: currentProduct?.priceRetail || 0,
      stockAlertQuantity: currentProduct?.stockAlertQuantity || 0,
      description: currentProduct?.description || '',
      inStock: true,
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  useEffect(() => {
    getAllCategories(notification).then((data) => {
      if (data) {
        setCategories(data);
      }
    });
    getAllUnits(notification).then((data) => {
      if (data) {
        setUnits(data);
      }
    });
  }, []);

  const onSubmit = async () => {
    if (getValues('category') === 'DEFAULT') {
      setCategoryError('Select a category');
      return;
    }
    setCategoryError('');
    setPriceError('');

    const raw = JSON.stringify({
      productName: getValues('productName'),
      code: getValues('code'),
      category: getValues('category'),
      brand: getValues('brand'),
      unit: getValues('unit'),
      quantity: getValues('quantity'),
      productCost: 0,
      priceHoreca: getValues('priceHoreca'),
      priceRetail: getValues('priceRetail'),
      stockAlertQuantity: getValues('stockAlertQuantity'),
      description: getValues('description'),
    });

    const requestOptions = {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: raw,
      redirect: 'follow',
      credentials: 'include',
    };

    try {
      await fetch(
        isEdit
          ? `${process.env.REACT_APP_BACKEND_URL}/product/updateproduct/${currentProduct._id}`
          : `${process.env.REACT_APP_BACKEND_URL}/product`,
        requestOptions
      )
        .then(async (res) => {
          if (res.ok) {
            res.json();
            await new Promise((resolve) => setTimeout(resolve, 500));
            reset();
            enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
            navigate(PATH_DASHBOARD.eCommerce.list);
          } else if (res.status === 401) {
            logout({ add: enqueueSnackbar, close: closeSnackbar }, navigate);
          }
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDiscard = () => {
    navigate(PATH_DASHBOARD.eCommerce.list);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField
                name="productName"
                label="Product Name"
                value={getValues('productName')}
                onChange={(event) => setValue('productName', event.target.value)}
              />

              <RHFTextField
                name="code"
                label="Product Code"
                value={getValues('code')}
                onChange={(event) => setValue('code', event.target.value)}
              />
              <RHFTextField
                name="brand"
                label="Product Brand"
                value={getValues('brand')}
                onChange={(event) => setValue('brand', event.target.value)}
              />

              <RHFTextFieldMultiLine
                label="Description"
                name="description"
                value={getValues('description')}
                onChange={(event) => setValue('description', event.target.value)}
              />
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              {/* <RHFSwitch name="inStock" label="In stock" /> */}
              <RHFTextField
                name="quantity"
                label="Quantity"
                value={getValues('quantity')}
                onChange={(event) => setValue('quantity', Number(event.target.value))}
                sx={{ marginY: 1 }}
                InputProps={{
                  type: 'number',
                }}
                disabled={isEdit}
              />
              <RHFTextField
                name="stockAlertQuantity"
                label="Stock Alert Quantity"
                value={getValues('stockAlertQuantity')}
                onChange={(event) => setValue('stockAlertQuantity', Number(event.target.value))}
                sx={{ marginY: 1 }}
                InputProps={{
                  type: 'number',
                }}
              />

              <Stack spacing={3} mt={2}>
                <RHFSelect
                  name="category"
                  value={getValues('category')}
                  onChange={(event) => setValue('category', event.target.value)}
                  required
                  sx={{ mb: -2 }}
                >
                  <option value={'DEFAULT'} disabled>
                    Select a category
                  </option>
                  {categories.map((category) => (
                    <option key={category.category} value={category.category}>
                      {category.category}
                    </option>
                  ))}
                </RHFSelect>
                <Typography sx={{ color: 'red', fontSize: '14px', pl: 1 }}>{categoryError}</Typography>

                <div>
                  <LabelStyle>Unit</LabelStyle>
                  <RHFRadioGroup
                    name="unit"
                    value={getValues('unit')}
                    onChange={(event) => setValue('unit', event.target.value)}
                    options={units}
                    sx={{
                      '& .MuiFormControlLabel-root': { mr: 4 },
                    }}
                  />
                </div>
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <RHFTextField
                  name="priceHoreca"
                  label="Price Horeca"
                  placeholder="0.00"
                  value={getValues('priceHoreca').$numberDecimal === 0 ? '' : getValues('priceHoreca').$numberDecimal}
                  onChange={(event) => setValue('priceHoreca', parseFloat(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'float',
                  }}
                  required
                />
                <RHFTextField
                  name="priceRetail"
                  label="Price Retail"
                  placeholder="0.00"
                  value={getValues('priceRetail').$numberDecimal === 0 ? '' : getValues('priceRetail').$numberDecimal}
                  onChange={(event) => setValue('priceRetail', parseFloat(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'float',
                  }}
                  required
                />
              </Stack>

              {/* <RHFSwitch name="taxes" label="Price includes taxes" /> */}
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Create Product' : 'Save Changes'}
            </LoadingButton>
            <LoadingButton type="submit" variant="outlined" size="large" onClick={handleDiscard}>
              Discard Changes
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
