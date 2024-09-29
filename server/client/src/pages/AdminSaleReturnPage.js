import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Table,
  Switch,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
  FormControlLabel,
  TableRow,
  TableHead,
  Paper,
  TableCell,
} from '@mui/material';
import { useSnackbar } from 'notistack';

// redux
import { useSelector } from '../redux/store';
import { DialogAnimate } from '../components/animate';

import useTable, { getComparator, emptyRows } from '../hooks/useTable';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import { PATH_DASHBOARD } from '../routes/paths';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { TableNoData, TableSkeleton, TableEmptyRows, TableHeadCustom } from '../components/table';
import SaleReturnTableRow from '../sections/@dashboard/sales/SaleReturnTableRow';
import { getSaleReturns } from '../sections/@dashboard/sales/scripts/sales-scripts';

const TABLE_HEAD = [
  { id: 'client', label: 'Company', align: 'left' },
  { id: 'nr_products', label: '#Products', align: 'left' },
  { id: 'amount', label: 'Amount', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
  { id: '' },
];

function AdminSalesPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
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
  const [myFilter, setMyFilter] = useState({});
  const [tableData, setTableData] = useState([]);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [filterName, setFilterName] = useState('');
  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [productsDisplayed, setProductsDisplayed] = useState();
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleView = (soldProd) => {
    setProductsDisplayed(soldProd);
    setIsOpen(true);
  };

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  useEffect(() => {
    getSaleReturns(notification, navigate).then((data) => {
      if (data) setTableData(data);
    });
  }, [myFilter, dataUpdated]);

  return (
    <Page title="Sale returns">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading="Sale returns"
          links={[
            {
              name: 'Sales',
              href: PATH_DASHBOARD.sales.list,
            },
            { name: 'Sales Returns' },
          ]}
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
                      <SaleReturnTableRow
                        key={index}
                        row={row}
                        isAdmin
                        onEditRow={() => setDataUpdated(true)}
                        handleView={handleView}
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
            rowsPerPageOptions={[5, 10, 25]}
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
        <DialogAnimate open={isOpen} maxWidth={'md'} onClose={handleCloseModal}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">#</TableCell>
                  <TableCell align="left">Product Name</TableCell>
                  <TableCell align="left">Quantity</TableCell>
                  <TableCell align="left">Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productsDisplayed &&
                  productsDisplayed.map((row, index) => (
                    <TableRow key={row.productName} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">{row.productName}</TableCell>

                      <TableCell align="left">{row.quantity}</TableCell>
                      <TableCell align="left">{row.soldPrice.$numberDecimal}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogAnimate>
      </Container>
    </Page>
  );
}

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

export default AdminSalesPage;
