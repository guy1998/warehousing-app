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
import { PATH_DASHBOARD } from '../routes/paths';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { TableNoData, TableSkeleton, TableEmptyRows, TableHeadCustom, TableSelectedActions } from '../components/table';
import { createSale, editSale, getSalesInformation } from '../sections/@dashboard/visits/scripts/sales-scripts';
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

const calculateGrandTotal = (soldProducts) => {
  return soldProducts.reduce((acc, product) => {
    return acc + parseFloat(product.soldPrice * product.quantity);
  }, 0);
};

const filterProducts = (products) => {
    const filteredProducts = products.filter((product) => product.quantity > 0);
    const mapped = filteredProducts.map((product) => {
      return { ...product, label: product.productName };
    });
    return mapped;
  };

const productExists = (products, productId) =>{
    const filtered = products.filter((product) => product._id === productId);
    return filtered.length !== 0;
}
  

function EditSalePage() {
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
  const { saleId = '' } = useParams();
  const [sale, setSale] = useState(null);
  const [user, setUser] = useState(null);

  const { enqueueSnackbar } = useSnackbar();
  const notification = { add: enqueueSnackbar };
  const { products, isLoading } = useSelector((state) => state.product);
  const [choiceProducts, setChoiceProducts] = useState([]);
  const [searchBarValue, setSearchBarValue] = useState('');
  const [notes, setNotes] = useState('');
  const [currentlySelected, setCurrentlySelected] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterName, setFilterName] = useState('');
  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const handleProductSelected = (event, newValue) => {
    setCurrentlySelected(newValue);
    const addable = {
      productName: newValue.productName,
      realProduct: newValue._id,
      quantity: 1,
      priceHoreca: newValue.priceHoreca.$numberDecimal,
      priceRetail: newValue.priceRetail.$numberDecimal,
      soldPrice:
        sale?.client.type === 'horeca' ? newValue.priceHoreca.$numberDecimal : newValue.priceRetail.$numberDecimal,
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

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  useEffect(() => {
    getOwnInformation(notification).then((data) => {
      if (data) setUser(data);
    });
    getAllProducts(notification, navigate).then(data=>{
        if(data) setChoiceProducts(filterProducts(data))
    })
    getSalesInformation(notification, navigate, saleId).then((data) => {
      if (data) {
        setSale(data);
        setTableData(
          data.soldProducts.map((product) => {
            let maxQuantity = 0;
            if(productExists(choiceProducts, product.realProduct)) {
                maxQuantity = choiceProducts.filter(choice => product.realProduct === choiceProducts._id)[0].quantity;
            }          
            return {
            ...product,
            soldPrice: product.soldPrice.$numberDecimal,
            priceHoreca: product.priceHoreca.$numberDecimal,
            priceRetail: product.priceRetail.$numberDecimal,
            maxQuantity: maxQuantity + product.quantity
          }})
        );
      }
    });
  }, []);

  return (
    <Page title="Sale list">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading="Edit Sale"
          links={[
            {
              name: 'Sales',
              href: PATH_DASHBOARD.sales.list,
            },
            { name: 'Edit Sale' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:close-fill" />}
              component={RouterLink}
              to={PATH_DASHBOARD.sales.list}
              style={{ background: 'red' }}
            >
              Cancel
            </Button>
          }
        />
        <Autocomplete
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
        />
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
        <LoadingButton
          loading={loading}
          style={buttonStyle}
          onClick={() => {
            if (tableData.length) {
              setLoading(true);
              editSale(
                notification,
                navigate,
                saleId,
                tableData.map(({ maxQuantity, ...rest }) => rest)
              );
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

export default EditSalePage;
