import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TablePagination,
  makeStyles,
} from '@material-ui/core';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import GetAppIcon from '@material-ui/icons/GetApp';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import { arrayOf } from 'prop-types';

import { changeRequest } from '../../shared/prop-types';
import ChplSortableHeaders  from '../util/chpl-sortable-headers';

const useStyles = makeStyles({
  container: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr",
    gap:'16px',
  },
  stickyColumn:{
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor:'#ffffff',
  },
  tableContainer: {
    maxHeight: "800px",
    overflowWrap:'normal',
    border:'.5px solid #c2c6ca',
  },
  tableActionContainer: {
    display: "grid",
    justifyContent:'end',
  },
  widgetContainer:{
    gap:'8px',
    display:'grid',
    alignContent:'space-between',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
});

function ChplChangeRequestHistory(props) {
  const classes = useStyles();
  const [changeRequests, setChangeRequests] = useState(props.changeRequests);

  const headers = [
    { text: 'Acting Organization', property: 'actingOrganization', sortable: true },
    { text: 'Date of Status Change', property: 'statusChangeDate', sortable: true },
    { text: 'Status', property: 'changeRequestStatusTypeName', sortable: true },
    { text: 'Comments', property: 'comment' },
  ];

  const listingSortComparator = (property) => {
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

  const handleTableSort = (event, property, orderDirection) => {
    setListings(listings.sort(listingSortComparator(orderDirection + property)).map((listing) => listing));
  };


  return (
    <div className={classes.container}>
      <TableContainer>
        <div className={classes.tableActionContainer}>
          <Button fullWidth color="secondary" variant="contained">Download
            <GetAppIcon className={classes.iconSpacing}/>
          </Button>
        </div>
      </TableContainer>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table stickyHeader>
          <ChplSortableHeaders
            headers={headers}
            onTableSort={handleTableSort}
          />
          <TableBody>
            {changeRequests
             .map((changeRequest) => (
               <TableRow key={changeRequest.id}>
                 <TableCell>{changeRequest.actingOrganization}</TableCell>
                 <TableCell>{changeRequest.statusChangeDate}</TableCell>
                 <TableCell>{changeRequest.comment}</TableCell>
               </TableRow>
             ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[50, 100, 200, { label: 'All' }]}
        component="div"
      />
    </div>
  );
}

export default ChplChangeRequestHistory;

ChplChangeRequestHistory.propTypes = {
  changeRequests: arrayOf(changeRequest).isRequired,
}
