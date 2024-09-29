import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// @mui
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

// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getZones } from '../../redux/slices/zone';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustomZone,
  TableSelectedActions,
} from '../../components/table';
// sections
import { ZoneTableRow, ZoneTableToolbar } from '../../sections/@dashboard/client/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'zone', label: 'Counties', align: 'left' },
  { id: 'count', label: 'Client Count', align: 'center' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function ZoneList() {
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

  const { zones, isLoading } = useSelector((state) => state.zone);

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    dispatch(getZones());
  }, [dispatch]);

  useEffect(() => {
    if (zones.length) {
      setTableData(zones);
    }
  }, [zones]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = async (name) => {
    const requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
      credentials: 'include',
    };

    await fetch(`${process.env.REACT_APP_BACKEND_URL}/client/zone/${name}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const resultJSON = JSON.parse(result);
        if (resultJSON.message === 'Zone deleted successfully!') {
          enqueueSnackbar('Zone Deleted Successfully');
          const deleteRow = tableData.filter((row) => row.zone !== name);
          setSelected([]);
          setTableData(deleteRow);
        } else if (resultJSON.message === 'There are still clients with this zone!') {
          enqueueSnackbar('There are still clients with this zone!', { variant: 'error' });
        } else {
          enqueueSnackbar('Zone Deleted Successfully');
          const deleteRow = tableData.filter((row) => row.zone !== name);
          setSelected([]);
          setTableData(deleteRow);
        }
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteRows = async (selected) => {
    const requestOptions = {
      method: 'DELETE',
      credentials: 'include',
      redirect: 'follow',
    };

    await fetch(`${process.env.REACT_APP_BACKEND_URL}/zone/deletemanyzone/${selected}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const resultJSON = JSON.parse(result);

        const deleteRows = resultJSON.tableData.filter((row) => !selected.includes(row));
        setSelected([]);
        setTableData(deleteRows);
        enqueueSnackbar('Zones Deleted Successfully');
        console.log(result);
      })
      .catch((error) => console.error(error));

    // console.log(selected);
  };

  const handleEditRow = (name) => {
    navigate(PATH_DASHBOARD.client.zoneEdit(paramCase(name)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  return (
    <Page title="County List">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading="County List"
          links={[
            {
              name: 'Clients',
              href: PATH_DASHBOARD.client.list,
            },
            { name: 'County List' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              component={RouterLink}
              to={PATH_DASHBOARD.client.zoneNew}
            >
              New County
            </Button>
          }
        />

        <Card>
          <ZoneTableToolbar filterName={filterName} onFilterName={handleFilterName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustomZone
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .reverse()
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <ZoneTableRow
                          key={row.zone}
                          row={row}
                          selected={selected.includes(row.zone)}
                          onSelectRow={() => onSelectRow(row.zone)}
                          onDeleteRow={() => handleDeleteRow(row.zone)}
                          onEditRow={() => handleEditRow(row.zone)}
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
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.zone.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return tableData;
}
