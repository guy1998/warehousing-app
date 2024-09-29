import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
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
  Menu,
} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { useDispatch, useSelector } from '../redux/store';
import useTable, { getComparator, emptyRows } from '../hooks/useTable';
import { AGENT_PATHS } from '../routes/paths';
import { TableNoData, TableSkeleton, TableEmptyRows, TableHeadCustom, TableSelectedActions } from '../components/table';
import { getClients, getZones } from '../sections/@dashboard/visits/scripts/client-scripts';
import ClientTableRow from '../sections/@dashboard/visits/ClientTableRow';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import { getOwnInformation } from '../sections/@dashboard/user/scripts';

const TABLE_HEAD = [
  { id: 'client', label: 'Client', align: 'left' },
  { id: 'zone', label: 'County', align: 'left' },
  { id: 'address', label: 'Address', align: 'left' },
  { id: '' },
];

const initialLoad = function (setClients, setZones, setTableData, notification, navigate, role) {
  let type;

  if (role === 'retail_agent') type = 'retail';
  else if (role === 'horeca_agent') type = 'horeca';

  getZones(notification, navigate).then((data) => {
    if (data) setZones(data);
  });
  getClients(notification, navigate).then((data) => {
    if (data) {
      const filteredClients = data.filter((client) => client.type === type);
      setClients(filteredClients);
      setTableData(filteredClients);
    }
  });
};

function CreateVisit() {
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
  const [user, setUser] = useState([]);

  const [clients, setClients] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedZone, setSelectedZone] = useState('All');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const notification = { add: enqueueSnackbar };
  const { products, isLoading } = useSelector((state) => state.product);
  const [filterName, setFilterName] = useState('');
  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const denseHeight = dense ? 60 : 80;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  useEffect(() => {
    getOwnInformation(notification).then((data) => {
      if (data) setUser(data);
    });
  }, []);

  useEffect(() => {
    if (user) {
      if (selectedZone === 'All') {
        initialLoad(setClients, setZones, setTableData, notification, navigate, user.role);
      }
      if (selectedZone && selectedZone !== 'All') {
        setTableData(clients.filter((client) => client.zone.toLowerCase() === selectedZone.toLowerCase()));
      } else {
        initialLoad(setClients, setZones, setTableData, notification, navigate, user.role);
      }
    }
  }, [selectedZone, user]);

  return (
    <Page title="Create visit">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading="Visits"
          links={[
            // { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Visits',
              href: AGENT_PATHS.visit.list,
            },
            { name: 'Visits List', href: '/agent/visit/list' },
            { name: 'Create' },
          ]}
        />
        <FormControl fullWidth style={{ marginBottom: '10px' }}>
          <InputLabel id="demo-simple-select-label">County</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedZone}
            label="County"
            onChange={(event) => setSelectedZone(event.target.value)}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 250,
                  overflowY: 'auto',
                },
              },
            }}
          >
            <MenuItem value={'All'}>All</MenuItem>
            {zones.map((zone, index) => {
              return (
                <MenuItem key={index} value={zone.zone}>
                  {zone.zone}
                </MenuItem>
              );
            })}
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
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    row ? (
                      <ClientTableRow
                        key={index}
                        row={row}
                        selected={row._id === selectedClient?._id}
                        uponSelect={setSelectedClient}
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

export default CreateVisit;
