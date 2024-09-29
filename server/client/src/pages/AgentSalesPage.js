import React, { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  DialogTitle,
  TextField,
  Typography,
  Divider,
  Paper,
  TableRow,
  TableHead,
  TableCell,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useSnackbar } from 'notistack';

// redux
import { useDispatch, useSelector } from '../redux/store';
import useSettings from '../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../hooks/useTable';
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import { AGENT_PATHS } from '../routes/paths';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { DialogAnimate } from '../components/animate';
import TotalSalesStats from './TotalSalesStats';

import { TableNoData, TableSkeleton, TableEmptyRows, TableHeadCustom, TableSelectedActions } from '../components/table';
import SalesTableRow from '../sections/@dashboard/sales/SalesTableRow';
import { getMySales } from '../sections/@dashboard/sales/scripts/sales-scripts';
import { getOwnInformation } from '../sections/@dashboard/user/scripts';

const TABLE_HEAD = [
  { id: 'client', label: 'Company', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'date', label: 'Date', align: 'left' },
  { id: 'agent', label: 'Agent', align: 'left' },
  { id: 'nr_products', label: '#Products', align: 'left' },
  { id: 'amount', label: 'Amount', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
  { id: '' },
];

function AgentSalesPage() {
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

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const notification = { add: enqueueSnackbar };
  const { isLoading } = useSelector((state) => state.product);
  const now = new Date();
  const [user, setUser] = useState(null);
  const [myFilter, setMyFilter] = useState({});
  const [value, setValue] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [total, setTotal] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const [products, setProducts] = useState();

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleView = (soldProd) => {
    // Calculate total price
    const totalPrice = soldProd.reduce((total, product) => {
      if(product.soldPrice)
        return parseFloat(total) + parseFloat(product.soldPrice.$numberDecimal) * parseFloat(product.quantity)
      const price =
        user.role === 'horeca_agent'
          ? parseFloat(product.priceHoreca.$numberDecimal)
          : parseFloat(product.priceRetail.$numberDecimal);
      return total + price;
    }, 0);

    // Set products and total in state
    setProducts(soldProd);
    setTotal(totalPrice.toFixed(2));
    setIsOpen(true);
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleFilterChange = (event) => {
    const option = event.target.value;
    setValue(event.target.value);
    if (option === 0) {
      setMyFilter({});
    } else if (option === 1) {
      const newFilter = {
        date: {
          $gte: new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)),
          $lte: new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)),
        },
      };
      setMyFilter(newFilter);
    } else if (option === 3) {
      setMyFilter({
        date: {
          $gte: new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)),
          $lte: new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)),
        },
      });
    } else {
      const firstDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0));
      firstDay.setDate(firstDay.getDate() - firstDay.getDay());
      const lastDay = new Date(Date.UTC(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + 7, 0, 0, 0));
      setMyFilter({ date: { $gte: firstDay, $lte: lastDay } });
    }
  };

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  useEffect(() => {
    getOwnInformation(notification).then((data) => {
      if (data) setUser(data);
    });
  }, []);

  useEffect(() => {
    getMySales(notification, navigate, myFilter).then((data) => {
      if (data) {
        setTableData(data);
      }
    });
  }, [myFilter]);

  return (
    <Page title="Sales list">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading="Sales"
          links={[
            {
              name: 'Sales',
              href: AGENT_PATHS.sale.list,
            },
            { name: 'Sales List' },
          ]}
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Time Period</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={value}
            label="Time Period"
            onChange={handleFilterChange}
            style={{ marginBottom: '15px' }}
          >
            <MenuItem value={0}>Unselected</MenuItem>
            <MenuItem value={1}>Today</MenuItem>
            <MenuItem value={2}>This week</MenuItem>
            <MenuItem value={3}>This month</MenuItem>
          </Select>
        </FormControl>
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
                  .reverse()
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    row ? (
                      <SalesTableRow key={index} row={row} handleView={handleView} />
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
        <TotalSalesStats sales={tableData}/>
        <DialogAnimate open={isOpen} maxWidth={'sm'} onClose={handleCloseModal}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 350 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">#</TableCell>
                  <TableCell align="left">Product Name</TableCell>
                  <TableCell align="left">Quantity</TableCell>
                  <TableCell align="left">Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products &&
                  products.map((row, index) => (
                    <TableRow key={row.productName} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">{row.productName}</TableCell>

                      <TableCell align="left">{row.quantity}</TableCell>
                        {row.soldPrice && <TableCell align="left">${row.soldPrice?.$numberDecimal}</TableCell>}
                        {(row.priceHoreca && !row.soldPrice) && <TableCell align="left">${user?.role === 'horeca_agent' ? row.priceHoreca?.$numberDecimal : row.priceRetail?.$numberDecimal}</TableCell>}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography align="center" fontSize={14} sx={{ mt: 1, mb: 1 }}>
            <b>Total:</b> ${total}
          </Typography>
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

export default AgentSalesPage;
