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
  TableFooter,
  TablePagination,
  TableRow,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, bool, func } from 'prop-types';

import theme from '../../../themes/theme';
import { getAngularService } from '../../../services/angular-react-helper';
import { ChplSortableHeaders } from '../../util';
import { complaint as complaintPropType } from '../../../shared/prop-types';

const useStyles = makeStyles(() => ({
  container: {
    maxHeight: '40vh',
  },
}));

/* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
const headers = [
  { property: 'acbName', text: 'ONC-ACB', sortable: true },
  { property: 'complaintStatusTypeName', text: 'Status', sortable: true },
  { property: 'receivedDate', text: 'Received Date', sortable: true },
  { property: 'acbComplaintId', text: 'ONC-ACB Complaint ID', sortable: true },
  { property: 'oncComplaintId', text: 'ONC Complaint ID', sortable: true },
  { property: 'complainantTypeName', text: 'Complainant Type', sortable: true },
  { property: 'actions', text: 'Actions', invisible: true, sortable: false },
];

const sortComparator = (property) => {
  let sortOrder = 1;
  let key = property;
  if (key[0] === '-') {
    sortOrder = -1;
    key = key.substr(1);
  }
  return (a, b) => {
    const result = (a[key] < b[key]) ? -1 : 1;
    return result * sortOrder;
  };
};

function ChplComplaints(props) {
  /* eslint-disable react/destructuring-assignment */
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { hasAnyRole } = getAngularService('authService');
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  useEffect(() => {
    setComplaints(props.complaints
      .map((complaint) => complaint)
      .sort(sortComparator('-receivedDate')));
  }, [props.complaints]); // eslint-disable-line react/destructuring-assignment

  const handleTableSort = (event, property, orderDirection) => {
    setComplaints(complaints
      .map((complaint) => complaint)
      .sort(sortComparator(orderDirection + property)));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAction = (action, complaint) => {
    props.dispatch(action, complaint);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, complaints.length - page * rowsPerPage);

  if (!complaints || complaints.length === 0) {
    return (
      <>No results found</>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <TableContainer className={classes.container} component={Paper}>
        <Table
          stickyHeader
          size="small"
          aria-label="Complaints table"
        >
          <ChplSortableHeaders
            headers={headers}
            onTableSort={handleTableSort}
            orderBy="receivedDate"
            order="desc"
          />
          { props.displayAdd // eslint-disable-line react/destructuring-assignment
            && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={headers.length}>
                  <Button
                    onClick={() => handleAction('add')}
                    color="primary"
                    variant="outlined"
                  >
                    Add New Complaint
                  </Button>
                </TableCell>
              </TableRow>
            </TableFooter>
            )}
          <TableBody>
            {complaints
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>{complaint.acbName}</TableCell>
                  <TableCell>
                    <Chip color="primary" label={complaint.complaintStatusTypeName} variant={complaint.complaintStatusTypeName === 'Open' ? 'outlined' : 'default'} />
                  </TableCell>
                  <TableCell>{complaint.receivedDate}</TableCell>
                  <TableCell>{complaint.acbComplaintId}</TableCell>
                  <TableCell>{complaint.oncComplaintId}</TableCell>
                  <TableCell>{complaint.complainantTypeName}</TableCell>
                  <TableCell>
                    <ButtonGroup
                      color="primary"
                    >
                      { hasAnyRole(['ROLE_ONC', 'ROLE_ONC_STAFF'])
                        && (
                        <Button
                          onClick={() => handleAction('view', complaint)}
                        >
                          View
                        </Button>
                        )}
                      { hasAnyRole(['ROLE_ADMIN', 'ROLE_ACB'])
                        && (
                        <Button
                          onClick={() => handleAction('edit', complaint)}
                        >
                          Edit
                        </Button>
                        )}
                      { hasAnyRole(['ROLE_ADMIN', 'ROLE_ACB'])
                        && (
                        <Button
                          onClick={() => handleAction('delete', complaint)}
                        >
                          Delete
                        </Button>
                        )}
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 33 * emptyRows }}>
                <TableCell colSpan={headers.length} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, { value: complaints.length, label: 'All' }]}
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
  displayAdd: bool,
  dispatch: func.isRequired,
};

ChplComplaints.defaultProps = {
  displayAdd: false,
};
