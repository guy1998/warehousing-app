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
} from '@mui/material';
import { useSnackbar } from 'notistack';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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
import VisitTableRow from '../sections/@dashboard/adminVisits/VisitTableRow';
import { getVisits } from '../sections/@dashboard/adminVisits/scripts/visit-scripts';

const TABLE_HEAD = [
  { id: 'client', label: 'Company', align: 'left' },
  { id: 'start_time', label: 'Start time', align: 'left' },
  { id: 'duration', label: 'Duration', align: 'left' },
  { id: 'agent', label: 'Agent', align: 'left' },
  { id: 'location', label: 'Location', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'images', label: 'Images', align: 'left' },
  { id: 'notes', label: 'notes', align: 'left' },
  { id: '' },
];

const sortByMostRecent = (arr) => {
  return arr.sort((a, b) => new Date(b.timeStart) - new Date(a.timeStart));
};

function AdminVisitsPage() {
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
  const { products, isLoading } = useSelector((state) => state.product);

  const [tableData, setTableData] = useState([]);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [filterName, setFilterName] = useState('');
  const now = new Date();
  const [filter, setFilter] = useState({});
  const [value, setValue] = useState(0);
  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleFilterChange = (event) => {
    const option = event.target.value;
    setValue(event.target.value);
    if (option === 0) {
      setFilter({});
    } else if (option === 1) {
      const newFilter = {
        timeStart: {
          $gte: new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)),
          $lte: new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)),
        },
      };
      setFilter(newFilter);
    } else if (option === 3) {
      setFilter({
        timeStart: {
          $gte: new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)),
          $lte: new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)),
        },
      });
    } else {
      const firstDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0));
      firstDay.setDate(firstDay.getDate() - firstDay.getDay());
      const lastDay = new Date(Date.UTC(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + 7, 0, 0, 0));
      setFilter({ timeStart: { $gte: firstDay, $lte: lastDay } });
    }
  };
  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const onEditRow = () => setDataUpdated(true);

  useEffect(() => {
    getVisits(notification, navigate, filter).then((data) => {
      if (data) setTableData(sortByMostRecent(data));
    });
    setDataUpdated(false);
  }, [dataUpdated, filter]);

  return (
    <Page title="Visit List">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading="Visits"
          links={[
            {
              name: 'Visits',
              href: PATH_DASHBOARD.visit.list,
            },
            { name: 'Visits List' },
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
          {/* <TableContainer sx={{ minWidth: 800 }}> */}
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
                    <VisitTableRow
                      key={index}
                      selected={false}
                      row={row}
                      onEditRow={setDataUpdated}
                      onDeleteRow={() => console.log('delete')}
                    />
                  ) : (
                    !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  )
                )}

              <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

              <TableNoData isNotFound={isNotFound} />
            </TableBody>
          </Table>
          {/* </TableContainer> */}
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

export default AdminVisitsPage;
