import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Switch,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';

// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableNoData, TableHeadCustomUser } from '../../components/table';
// sections
import { ClientTableToolbar, ClientTableRow } from '../../sections/@dashboard/client/list';
import { getAllClients, getAllZones } from '../../sections/@dashboard/client/scripts';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'clientname', label: 'Client', align: 'left' },
  { id: 'company_name', label: 'Company', align: 'left' },
  { id: 'address', label: 'Address', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'Zone', label: 'County', align: 'left' },
  { id: 'phone', label: 'Phone number', align: 'left' },

  { id: '' },
];

// ----------------------------------------------------------------------

export default function ClientList() {
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
  } = useTable();

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [updateList, setUpdateList] = useState(false);
  const [zones, setZones] = useState([{}]);
  const [filterName, setFilterName] = useState('');

  const [filterZone, setFilterZone] = useState('all');

  const { currentTab: filterZones, onChangeTab: onChangeFilterZones } = useTabs('all');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notification = { add: enqueueSnackbar, close: closeSnackbar };
  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterZone = (event) => {
    setFilterZone(event.target.value);
  };

  const handleDeleteRow = (id) => {
    const requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
      credentials: 'include',
    };

    fetch(`${process.env.REACT_APP_BACKEND_URL}/client/deleteclient/${id}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const resultJSON = JSON.parse(result);

        if (resultJSON.result) {
          const deleteRow = tableData.filter((row) => row._id !== id);
          setSelected([]);
          setTableData(deleteRow);
          enqueueSnackbar('Client deleted successfully');
        } else {
          enqueueSnackbar('Failed to delete a client', { variant: 'error' });
        }
      })
      .catch((error) => console.error(error));
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.client.edit(paramCase(id)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterZone,
    filterZones,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterZone) ||
    (!dataFiltered.length && !!filterZones);

  useEffect(() => {
    getAllZones(notification).then((data) => {
      if (data) {
        setZones(data);
      }
    });
    getAllClients(notification).then((data) => {
      if (data) {
        setTableData(data);
        setUpdateList(false);
      }
    });
  }, [updateList]);

  return (
    <Page title="Client List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Client List"
          links={[{ name: 'Client', href: PATH_DASHBOARD.ClientList }, { name: 'List' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.client.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Client
            </Button>
          }
        />

        <Card>
          <ClientTableToolbar
            filterName={filterName}
            filterZone={filterZone}
            onFilterName={handleFilterName}
            onFilterZone={handleFilterZone}
            optionsZone={zones}
          />

          <Scrollbar>
            <Table size={dense ? 'small' : 'medium'}>
              <TableHeadCustomUser
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={selected.length}
                onSort={onSort}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
              />

              <TableBody>
                {dataFiltered
                  .reverse()
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <ClientTableRow
                      key={row._id}
                      row={row}
                      selected={selected.includes(row._id)}
                      onSelectRow={() => onSelectRow(row._id)}
                      updateList={setUpdateList}
                      onEditRow={() => handleEditRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                    />
                  ))}

                <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
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
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName, filterZones, filterZone }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.clientname.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  if (filterZones !== 'all') {
    tableData = tableData.filter((item) => item.status === filterZones);
  }

  if (filterZone !== 'all') {
    tableData = tableData.filter((item) => item.zone === filterZone);
  }

  return tableData;
}
