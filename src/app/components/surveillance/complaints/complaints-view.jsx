import React, { useEffect, useState } from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { ChplEllipsis, ChplSortableHeaders } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { complaint as complaintPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    maxHeight: '64vh',
  },
  deleteButton: {
    backgroundColor: '#c44f65',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#853544',
    },
  },
  statusIndicatorOpen: {
    color: '#66926d',
  },
  statusIndicatorClosed: {
    color: 'rgba(0, 0, 0, 0.87)',
  },
});

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

function ChplComplaintsView(props) {
  /* eslint-disable react/destructuring-assignment */
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const DateUtil = getAngularService('DateUtil');
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

  if (!complaints || complaints.length === 0) {
    return (
      <>No results found</>
    );
  }

  return (
    <>
      <TableContainer className={classes.container} component={Paper}>
        <Table
          stickyHeader
          aria-label="Complaints table"
        >
          <ChplSortableHeaders
            headers={headers}
            onTableSort={handleTableSort}
            orderBy="receivedDate"
            order="desc"
          />
          <TableBody>
            {complaints
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>{complaint.acbName}</TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle1"
                      className={complaint.complaintStatusTypeName === 'Open' ? classes.statusIndicatorOpen : classes.statusIndicatorClosed}
                    >
                      {complaint.complaintStatusTypeName}
                    </Typography>
                  </TableCell>
                  <TableCell>{DateUtil.getDisplayDateFormat(complaint.receivedDate)}</TableCell>
                  <TableCell>{complaint.acbComplaintId}</TableCell>
                  <TableCell>
                    { complaint.oncComplaintId && <ChplEllipsis text={complaint.oncComplaintId} maxLength={50} /> }
                  </TableCell>
                  <TableCell>{complaint.complainantTypeName}</TableCell>
                  <TableCell align="right">
                    <Button
                      onClick={() => handleAction('view', complaint)}
                      variant="contained"
                      color="primary"
                    >
                      View
                      {' '}
                      <VisibilityIcon className={classes.iconSpacing} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[50, 100, 200, { value: complaints.length, label: 'All' }]}
        component="div"
        count={complaints.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

export default ChplComplaintsView;

ChplComplaintsView.propTypes = {
  complaints: arrayOf(complaintPropType).isRequired,
  dispatch: func.isRequired,
};
