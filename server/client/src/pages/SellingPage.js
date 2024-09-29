import React, { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink, useParams, useLocation } from 'react-router-dom';

import {
  Box,
  Card,
  Table,
  Button,
  Switch,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Typography,
  InputLabel,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
// redux
import { useDispatch, useSelector } from '../redux/store';
import useSettings from '../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../hooks/useTable';
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import { AGENT_PATHS } from '../routes/paths';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { TableNoData, TableSkeleton, TableEmptyRows, TableHeadCustom, TableSelectedActions } from '../components/table';
import { usePhotoGallery } from '../hooks/usePhotoGallery';
import { getVisitInfo } from '../sections/@dashboard/visits/scripts/visit-scripts';
import { createSale } from '../sections/@dashboard/visits/scripts/sales-scripts';
import { getAllProducts } from '../sections/@dashboard/visits/scripts/product-scripts';
import SoldProductTable from '../sections/@dashboard/visits/SoldProductTable';
import { fCurrency } from '../utils/formatNumber';
import { getOwnInformation } from '../sections/@dashboard/user/scripts';

const TABLE_HEAD = [
  { id: 'product', label: 'Product', align: 'left' },
  { id: 'unit', label: 'Unit', align: 'center' },
  { id: 'max_quantity', label: 'Max Quantity', align: 'center' },
  { id: 'quantity', label: 'quantity', align: 'left' },
  { id: 'price', label: 'Price', align: 'left' },
  { id: 'subtotal', label: 'Subtotal', align: 'center' },
  { id: '' },
];

// const filterProducts = (products) => {
//   const mapped = products.map((product) => {
//     return { ...product, label: product.productName };
//   });
//   return mapped;
// };
const filterProducts = (products) => {
  const filteredProducts = products.filter((product) => product.quantity > 0);
  const mapped = filteredProducts.map((product) => {
    return { ...product, label: product.productName };
  });
  return mapped;
};

const calculateGrandTotal = (soldProducts) => {
  return soldProducts.reduce((acc, product) => {
    return acc + parseFloat(product.soldPrice * product.quantity);
  }, 0);
};

const generateSale = (visit, soldProducts) => {
  return { client: visit.client, soldProducts };
};

function SellingPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const { themeStretch } = useSettings();

  const navigate = useNavigate();
  const { visitId = '' } = useParams();
  const [visit, setVisit] = useState(null);
  const [imageOne, setImageOne] = useState(null);
  const [imageTwo, setImageTwo] = useState(null);
  const { takePhoto } = usePhotoGallery();

  const handleChangeImageOne = (event) => {
    setImageOne(event.target.files[0]);
  };

  const handleChangeImageTwo = (event) => {
    setImageTwo(event.target.files[0]);
  };

  const [user, setUser] = useState(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { enqueueSnackbar } = useSnackbar();
  const notification = { add: enqueueSnackbar };
  const { products, isLoading } = useSelector((state) => state.product);
  const [choiceProducts, setChoiceProducts] = useState([]);
  const [searchBarValue, setSearchBarValue] = useState('');
  const [notes, setNotes] = useState('');
  const [currentlySelected, setCurrentlySelected] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterName, setFilterName] = useState('');
  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleCategorySelected = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleProductSelected = (event, newValue) => {
    setCurrentlySelected(newValue);
    const addable = {
      productName: newValue.productName,
      realProduct: newValue._id,
      quantity: 1,
      priceHoreca: newValue.priceHoreca.$numberDecimal,
      priceRetail: newValue.priceRetail.$numberDecimal,
      soldPrice:
        user?.role === 'horeca_agent' ? newValue.priceHoreca.$numberDecimal : newValue.priceRetail.$numberDecimal,
      unit: newValue.unit,
      maxQuantity: newValue.quantity,
    };
    if (!newValue) return;
    if (tableData.map(({ realProduct, ...rest }) => realProduct).includes(addable.realProduct))
      notification.add('Product is already selected', { variant: 'info' });
    else {
      setTableData([...tableData, addable]);
    }
  };

  // const handleProductSelected = (event, newValue) => {
  //   setCurrentlySelected(newValue);
  //   const addable = {
  //     productName: newValue.productName,
  //     realProduct: newValue._id,
  //     quantity: 1,
  //     priceHoreca: newValue.priceHoreca.$numberDecimal,
  //     priceRetail: newValue.priceRetail.$numberDecimal,
  //     soldPrice:
  //       user?.role === 'horeca_agent' ? newValue.priceHoreca.$numberDecimal : newValue.priceRetail.$numberDecimal,
  //     unit: newValue.unit,
  //     maxQuantity: newValue.quantity,
  //   };
  //   if (!newValue) return;
  //   if (tableData.map(({ realProduct, ...rest }) => realProduct).includes(addable.realProduct))
  //     notification.add('Product is already selected', { variant: 'info' });
  //   else {
  //     setTableData([...tableData, addable]);
  //   }
  // };

  const onRowEdit = (productId, field, newValue) => {
    const newProducts = tableData.map((product) => {
      if (product.realProduct === productId) {
        product[field] = newValue;
      }
      return product;
    });
    setTableData(newProducts);
  };

  const onRowDelete = (productId) => {
    const newTableData = tableData.filter((product) => product.realProduct !== productId);
    setTableData(newTableData);
  };

  const handleChangeNotes = (event) => {
    setNotes(event.target.value);
  };

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  useEffect(() => {
    getVisitInfo(notification, navigate, visitId).then((data) => {
      if (!data) {
        navigate('/agent/visit/list');
      } else {
        setVisit(data);
        getAllProducts(notification, navigate).then((allProducts) => {
          setChoiceProducts(filterProducts(allProducts));
          // console.log(JSON.stringify(filterProducts(allProducts)[0]));
        });
      }
    });
  }, []);

  useEffect(() => {
    getOwnInformation(notification).then((data) => {
      if (data) setUser(data);
    });
  }, []);

  useEffect(() => {
    getAllProducts(notification, navigate).then((allProducts) => {
      const filteredProducts = filterProducts(allProducts);
      setChoiceProducts(filteredProducts);
      console.log(allProducts.length);
      setCategories([...new Set(filteredProducts.map((product) => product.category))]);
    });
  }, []);

  useEffect(() => {
    console.log(categories);
  }, [categories]);

  return (
    <Page title="Visit List">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading="New Sale"
          links={[
            // { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Visit',
              href: AGENT_PATHS.visit.list,
            },
            { name: 'New sale' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:close-fill" />}
              component={RouterLink}
              to={AGENT_PATHS.visit.list}
              style={{ background: 'red' }}
            >
              Cancel
            </Button>
          }
        />
        {/* <Autocomplete
          disablePortal
          fullWidth
          style={{ marginBottom: '20px' }}
          inputValue={searchBarValue}
          value={currentlySelected}
          id="combo-box-demo"
          options={choiceProducts}
          onInputChange={(event, newInputValue) => setSearchBarValue(newInputValue)}
          onChange={handleProductSelected}
          renderInput={(params) => <TextField {...params} label="Product" />}
        /> */}
        <>
          <Autocomplete
            disablePortal
            fullWidth
            style={{ marginBottom: '20px' }}
            options={categories}
            value={selectedCategory}
            onChange={handleCategorySelected}
            renderInput={(params) => <TextField {...params} label="Category" />}
          />

          {selectedCategory && (
            <Autocomplete
              disablePortal
              fullWidth
              style={{ marginBottom: '20px' }}
              inputValue={searchBarValue}
              value={currentlySelected}
              id="combo-box-demo"
              options={choiceProducts.filter((product) => product.category === selectedCategory)}
              onInputChange={(event, newInputValue) => setSearchBarValue(newInputValue)}
              onChange={handleProductSelected}
              renderInput={(params) => <TextField {...params} label="Product" />}
            />
          )}
        </>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table size={dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={selected.length}
                onSort={onSort}
                onSelectAllRows={null}
              />

              <TableBody>
                {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    row ? (
                      <SoldProductTable
                        key={index}
                        row={row}
                        index={index}
                        selected={false}
                        onEditRow={onRowEdit}
                        onDeleteRow={onRowDelete}
                        userRole={user?.role}
                      />
                    ) : (
                      !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    )
                  )}

                <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <Box sx={{ position: 'relative' }}>
          <TablePagination
            rowsPerPageOptions={[5]}
            component="div"
            count={dataFiltered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />

          <FormControlLabel
            control={<Switch checked={dense} onChange={onChangeDense} />}
            label="Dense"
            sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
          />
        </Box>
        <Typography style={{ marginBottom: '20px' }}>
          {`Grand total: ${fCurrency(calculateGrandTotal(tableData))}`}
        </Typography>
        <InputLabel
          htmlFor="imageOne"
          style={inputStyle}
          onClick={() => {
            takePhoto().then((file) => {
              setImageOne(file);
            });
          }}
        >
          <Iconify icon={'eva:image-outline'} style={{ height: '50%', width: '10%' }} />
          {imageOne ? imageOne.name : 'First image'}
        </InputLabel>
        {/* <input id="imageOne" name="imageOne" type="file" style={{ display: 'none' }} onChange={handleChangeImageOne} /> */}
        <InputLabel
          htmlFor="imageOne"
          style={inputStyle}
          onClick={() => {
            takePhoto().then((file) => {
              setImageTwo(file);
            });
          }}
        >
          <Iconify icon={'eva:image-outline'} style={{ height: '50%', width: '10%' }} />
          {imageTwo ? imageTwo.name : 'Second image'}
        </InputLabel>
        {/* <input id="imageTwo" name="imageTwo" type="file" style={{ display: 'none' }} onChange={handleChangeImageTwo} /> */}
        <TextField
          id="filled-multiline-flexible"
          label="Notes"
          variant="filled"
          fullWidth
          multiline
          maxRows={4}
          onChange={handleChangeNotes}
        />
        <LoadingButton
          loading={loading}
          style={buttonStyle}
          onClick={() => {
            if (tableData.length) {
              setLoading(true);
              const newSale = generateSale(
                visit,
                tableData.map(({ maxQuantity, ...rest }) => rest)
              );
              createSale(notification, navigate, imageOne, imageTwo, visit._id, notes, newSale);
            } else {
              notification.add('You must select products to sell first!', { variant: 'error' });
            }
          }}
        >
          {loading ? '' : 'Confirm'}
        </LoadingButton>
      </Container>
    </Page>
  );
}

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
  width: '30%',
  height: '50px',
  backgroundColor: 'green',
  color: 'white',
  marginTop: '15px',
};

function applySortFilter({ tableData, comparator, filterName }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.productName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return tableData;
}

export default SellingPage;
