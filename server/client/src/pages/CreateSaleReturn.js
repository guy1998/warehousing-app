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
import SoldProductTable from '../sections/@dashboard/visits/SoldProductTable';
import { fCurrency } from '../utils/formatNumber';
import { getSalesInfo, addSaleReturn } from '../sections/@dashboard/sales/scripts/sales-scripts';
import SaleReturnRow from '../sections/@dashboard/sales/SaleReturnRow';

const TABLE_HEAD = [
  { id: 'product', label: 'Product', align: 'left' },
  { id: 'unit', label: 'Unit', align: 'center' },
  { id: 'quantity', label: 'quantity sold', align: 'left' },
  { id: 'returned', label: 'Returned quantity', align: 'left' },
];

const getReturnInformation = (soldProducts) => {
  const newReturnInfo = {};
  soldProducts.forEach((product) => {
    newReturnInfo[product.realProduct] = 0;
  });
  return newReturnInfo;
};

const checkIfReturned = (returnInformation) => {
  return Object.values(returnInformation).some((value) => value > 0);
};

function CreateSaleReturn() {
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
  const { saleId = '' } = useParams();
  const [sale, setSale] = useState(null);
  const [returnInformation, setReturnInformation] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const notification = { add: enqueueSnackbar };
  const { products, isLoading } = useSelector((state) => state.product);
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
  // SaleReturn validation failed: products.0.price: Path `price` is required.
  const handleProductSelected = (event, newValue) => {
    setCurrentlySelected(newValue);
    const addable = {
      productName: newValue.productName,
      realProduct: newValue._id,
      quantity: 1,
      price: parseFloat(newValue.productPrice.$numberDecimal),
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

  const onRowEdit = (productId, newValue) => {
    const newInfo = { ...returnInformation };
    newInfo[productId] = newValue;
    setReturnInformation({ ...newInfo });
  };
  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  useEffect(() => {
    getSalesInfo(notification, navigate, saleId).then((data) => {
      if (data) {
        setTableData(data.soldProducts);
        setReturnInformation(getReturnInformation(data.soldProducts));
        setSale(data);
      }
    });
  }, []);

  return (
    <Page title="Sale return">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading="New sale return"
          links={[
            {
              name: 'Sale',
              href: PATH_DASHBOARD.sales.list,
            },
            { name: 'Sale return' },
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
                      <SaleReturnRow key={index} row={row} onEditRow={onRowEdit} />
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
        <LoadingButton
          loading={loading}
          style={buttonStyle}
          onClick={() => {
            setLoading(true);
            if (checkIfReturned(returnInformation)) addSaleReturn(notification, navigate, saleId, returnInformation);
            else {
              notification.add('You have not changed any quantity', { variant: 'info' });
              setLoading(false);
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

export default CreateSaleReturn;
