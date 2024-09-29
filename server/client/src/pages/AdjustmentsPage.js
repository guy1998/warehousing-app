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
import { AGENT_PATHS, PATH_DASHBOARD } from '../routes/paths';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { TableNoData, TableSkeleton, TableEmptyRows, TableHeadCustom, TableSelectedActions } from '../components/table';

import { getAllProducts, productAdd, productSubtract } from '../sections/@dashboard/visits/scripts/product-scripts';
import AdjustmentsTable from '../sections/@dashboard/visits/AdjustmentsTable';

const TABLE_HEAD = [
  { id: 'product', label: 'Product', align: 'left' },
  { id: 'unit', label: 'Unit', align: 'center' },
  { id: 'max_quantity', label: 'Current Quantity', align: 'center' },
  { id: 'quantity', label: 'quantity', align: 'left' },
  { id: 'price', label: 'Type', align: 'left' },
  { id: 'stockAlert', label: 'Stock Alert', align: 'center' },
  { id: '' },
];

const filterProducts = (products) => {
  const filteredProducts = products.filter((product) => product);
  const mapped = filteredProducts.map((product) => {
    return { ...product, label: product.productName };
  });
  return mapped;
};

function AdjustmentsPage() {
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

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const notification = { add: enqueueSnackbar };
  const { isLoading } = useSelector((state) => state.product);
  const [choiceProducts, setChoiceProducts] = useState([]);
  const [searchBarValue, setSearchBarValue] = useState('');

  const [currentlySelected, setCurrentlySelected] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterName, setFilterName] = useState('');
  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const handleProductSelected = (event, newValue) => {
    if (!newValue) return;

    setCurrentlySelected(newValue);
    const addable = {
      realProduct: newValue._id,
      productName: newValue.productName,
      unit: newValue.unit,
      maxQuantity: newValue.quantity,
      stockAlert: newValue.stockAlertQuantity,
      quantity: 1,
      type: 'Addition',
    };
    if (tableData.map(({ realProduct, ...rest }) => realProduct).includes(addable.realProduct)) {
      notification.add('Product is already selected', { variant: 'info' });
      setCurrentlySelected(null);
    } else {
      setTableData([...tableData, addable]);
      setCurrentlySelected(null);
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
    getAllProducts(notification, navigate).then((allProducts) => {
      setChoiceProducts(filterProducts(allProducts));
    });
  }, [tableData]);

  const handleDiscard = async () => {
    setTableData([]);
  };

  const handleConfirm = async () => {
    if (tableData.length) {
      setLoading(true);
      try {
        const requests = tableData.map(async (product) => {
          const payload = [
            {
              id: product.realProduct,
              quantity: product.quantity,
            },
          ];

          if (product.type === 'Addition') {
            await productAdd(notification, navigate, payload);
          }
          if (product.type === 'Subtraction') {
            await productSubtract(notification, navigate, payload);
          }
        });
        await Promise.all(requests);

        setTableData([]);
      } catch (error) {
        console.error('Error adjusting products:', error);
        notification.add('Error adjusting products!', { variant: 'error' });
      } finally {
        setCurrentlySelected(null);
        setLoading(false);
      }
    } else {
      notification.add('You must select products to adjust first!', { variant: 'error' });
    }
  };

  return (
    <Page title="New Adjustment">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs heading="New Adjustment" links={[{ name: '' }]} />
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
                      <AdjustmentsTable
                        key={index}
                        row={row}
                        index={index}
                        selected={false}
                        onEditRow={onRowEdit}
                        onDeleteRow={onRowDelete}
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
        <LoadingButton loading={loading} variant="contained" size="large" onClick={handleConfirm}>
          {loading ? '' : 'Confirm'}
        </LoadingButton>{' '}
        {/* <br /> */}
        <LoadingButton variant="outlined" size="large" onClick={handleDiscard}>
          Discard
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

export default AdjustmentsPage;
