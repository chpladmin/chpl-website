import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import EventIcon from '@material-ui/icons/Event';
import { arrayOf, func } from 'prop-types';

import { ChplSortableHeaders, sortComparator } from 'components/util/sortable-headers';
import { UserContext } from 'shared/contexts';
import { job as jobType } from 'shared/prop-types';

const headers = [
  { property: 'name', text: 'Report Name', sortable: true },
  { property: 'description', text: 'Description' },
  { property: 'oncAcbSpecific', text: 'ONC-ACB Specific', sortable: true },
  { property: 'actions', text: 'Actions', invisible: true },
];

const useStyles = makeStyles({
  container: {
    maxHeight: '64vh',
  },
  firstColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#fff',
  },
});

const getAction = (item, dispatch) => {
  if (item.jobDataMap.editableJobFields) {
    return (
      <IconButton
        onClick={() => dispatch({ action: 'edit', payload: item })}
        variant="contained"
        color="primary"
        aria-label={`Edit Report ${item.name}`}
      >
        <EditIcon />
      </IconButton>
    );
  }
  if (item.group === 'chplJobs') {
    return (
      <IconButton
        onClick={() => dispatch({ action: 'schedule', payload: item })}
        color="primary"
        aria-label={`Schedule Report ${item.name}`}
      >
        <EventIcon />
      </IconButton>
    );
  }
  return null;
};

function ChplReportJobTypesView(props) {
  const { dispatch } = props;
  const { hasAnyRole } = useContext(UserContext);
  const [jobTypes, setJobTypes] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const classes = useStyles();

  useEffect(() => {
    setJobTypes(props.jobTypes
      .map((job) => ({
        ...job,
        oncAcbSpecific: job.jobDataMap.acbSpecific ? 'Yes' : 'No',
        action: getAction(job, dispatch),
      }))
      .sort(sortComparator('name')));
  }, []);

  const filterHeaders = () => headers.filter((item) => hasAnyRole(['ROLE_ADMIN'])
                          || (item.property === 'oncAcbSpecific' && hasAnyRole(['ROLE_ONC']))
                          || (item.property !== 'oncAcbSpecific'));

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = jobTypes.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setJobTypes(updated);
  };

  return (
    <Card>
      <CardHeader title="Types of Reports" />
      <CardContent>
        <TableContainer className={classes.container} component={Paper}>
          <Table
            aria-label="Types of Reports table"
          >
            <ChplSortableHeaders
              headers={filterHeaders()}
              onTableSort={handleTableSort}
              orderBy={orderBy}
              order={order}
              stickyHeader
            />
            <TableBody>
              { jobTypes
                .map((item) => (
                  <TableRow key={item.name}>
                    <TableCell className={classes.firstColumn}>
                      { item.name }
                    </TableCell>
                    <TableCell>
                      { item.description }
                    </TableCell>
                    { hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])
                      && (
                        <TableCell>
                          { item.oncAcbSpecific }
                        </TableCell>
                      )}
                    <TableCell align="right">
                      { item.action }
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

export default ChplReportJobTypesView;

ChplReportJobTypesView.propTypes = {
  jobTypes: arrayOf(jobType).isRequired,
  dispatch: func.isRequired,
};
