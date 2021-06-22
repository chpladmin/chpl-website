import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, bool, func, number, object, oneOf, string } from 'prop-types';

import theme from '../../../themes/theme';
import { complaint as complaintPropType } from '../../../shared/prop-types';

const useStyles = makeStyles(() => ({
}));

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) =>{
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const headCells = [
  { id: 'acbName', label: 'ONC-ACB' },
  { id: 'complaintStatusTypeName', label: 'Status' },
  { id: 'receivedDate', label: 'Received Date' },
  { id: 'acbComplaintId', label: 'ONC-ACB Complaint ID' },
  { id: 'oncComplaintId', label: 'ONC Complaint ID' },
  { id: 'complainantTypeName', label: 'Complainant Type' },
  { id: 'actions', label: 'Actions', doNotSort: true, },
];

const EnhancedTableHead = (props) => {
  const { onRequestSort, order, orderBy, rowCount } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            { headCell.doNotSort ?
              <Typography variant="srOnly">
                {headCell.label}
              </Typography>
              : (
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Typography variant="srOnly">
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Typography>
                  ) : null}
                </TableSortLabel>
              )
            }
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  onRequestSort: func.isRequired,
  order: oneOf(['asc', 'desc']).isRequired,
  orderBy: string.isRequired,
  rowCount: number.isRequired,
};

function ChplComplaints(props) {
  /* eslint-disable react/destructuring-assignment */
  const [complaints, setComplaints] = useState([]);
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('receivedDate');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  useEffect(() => {
    setComplaints(props.complaints);
  }, [props.complaints]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (complaint) => {
    props.dispatch('delete', complaint);
  }

  const handleEdit = (complaint) => {
    props.dispatch('edit', complaint);
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, complaints.length - page * rowsPerPage);

  if (!complaints || complaints.length === 0) {
    return (
      <>No results found</>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper}>
        <Table
          size="small"
          aria-label="Complaints table"
        >
          <EnhancedTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={complaints.length}
          />
          <TableBody>
            {stableSort(complaints, getComparator(order, orderBy))
             .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
             .map((complaint, index) => {
               return (
                 <TableRow key={complaint.id}>
                   <TableCell>{complaint.acbName}</TableCell>
                   <TableCell>
                     <Chip color="primary" label={complaint.complaintStatusTypeName} variant={complaint.complaintStatusTypeName === 'Open' ? 'outlined' : 'default'}/>
                   </TableCell>
                   <TableCell>{complaint.receivedDate}</TableCell>
                   <TableCell>{complaint.acbComplaintId}</TableCell>
                   <TableCell>{complaint.oncComplaintId}</TableCell>
                   <TableCell>{complaint.complainantTypeName}</TableCell>
                   <TableCell>
                     <ButtonGroup
                       color="primary">
                       <Button
                         onClick={() => handleEdit(complaint)}
                       >Edit
                       </Button>
                       <Button
                         onClick={() => handleDelete(complaint)}
                       >Delete
                       </Button>
                     </ButtonGroup>
                   </TableCell>
                 </TableRow>
               );
             })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 33 * emptyRows }}>
                <TableCell colSpan={headCells.length} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={complaints.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </ThemeProvider>
  );
}

export default ChplComplaints;

ChplComplaints.propTypes = {
  complaints: arrayOf(complaintPropType).isRequired,
  dispatch: func.isRequired,
};
