import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { arrayOf, func } from 'prop-types';

import { ChplSortableHeaders } from 'components/util';
import { UserContext } from 'shared/contexts';
import { jobType } from 'shared/prop-types';

const headers = [
  { property: 'name', text: 'Job Name', sortable: true },
  { property: 'description', text: 'Description' },
  { property: 'oncAcbSpecific', text: 'ONC-ACB Specific', sortable: true },
  { property: 'jobType', text: 'Job Type', sortable: true },
  { property: 'actions', text: 'Actions', invisible: true },
];

const sortComparator = (property, sortDescending) => (a, b) => {
  const result = (a[property] < b[property]) ? -1 : 1;
  return result * (sortDescending ? -1 : 1);
};

const useStyles = makeStyles({
  container: {
    maxHeight: '64vh',
  },
  cardSpacing: {
    marginTop: '32px',
  },
  firstColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#ffffff',
  },
});

const groupMapping = {
  systemJobs: 'System Job',
  chplJobs: 'User Job',
  subordinateJobs: 'Subordinate Job',
};

const getAction = (item, dispatch) => {
  if (item.jobDataMap.editableJobFields) {
    return (
      <Button
        onClick={() => dispatch({ action: 'edit', payload: item })}
        variant="contained"
        color="primary"
        aria-label="Edit Job"
      >
        <EditOutlinedIcon />
      </Button>
    );
  }
  switch (item.group) {
    case 'chplJobs':
      return (
        <Button
          onClick={() => dispatch({ action: 'schedule', payload: item })}
          variant="contained"
          color="primary"
          aria-label="Schedule Job"
        >
          <ScheduleIcon />
        </Button>
      );
    case 'systemJobs':
      return (
        <Button
          onClick={() => dispatch({ action: 'schedule', payload: item })}
          variant="contained"
          color="primary"
          aria-label="Schedule Job"
        >
          <PlayArrowIcon />
        </Button>
      );
    case 'subordinateJobs':
      return null;
      // no default
  }
  return null;
};

function ChplJobTypesView(props) {
  const { dispatch } = props;
  const { hasAnyRole } = useContext(UserContext);
  const [jobTypes, setJobTypes] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [sortDescending, setSortDescending] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    setJobTypes(props.jobTypes
      .map((job) => ({
        ...job,
        oncAcbSpecific: job.jobDataMap.acbSpecific ? 'Yes' : 'No',
        jobType: groupMapping[job.group],
        action: getAction(job, dispatch),
      }))
      .sort(sortComparator(orderBy, sortDescending)));
  }, [props.jobTypes, dispatch]); // eslint-disable-line react/destructuring-assignment

  const filterHeaders = () => {
    return headers.filter((item) => hasAnyRole(['ROLE_ADMIN']) || item.property !== 'jobType');
  };

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === '';
    setSortDescending(descending);
    setOrderBy(property);
    setJobTypes(jobTypes.sort(sortComparator(property, descending)));
  };

  return (
    <Card className={classes.cardSpacing}>
      <CardHeader title="Types of Jobs" />
      <CardContent>
        <TableContainer className={classes.container} component={Paper}>
          <Table
            aria-label="Types of Jobs table"
          >
            <ChplSortableHeaders
              headers={filterHeaders()}
              onTableSort={handleTableSort}
              orderBy={orderBy}
              order={sortDescending ? 'desc' : 'asc'}
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
                    <TableCell>
                      { item.oncAcbSpecific }
                    </TableCell>
                    { hasAnyRole(['ROLE_ADMIN'])
                      && (
                        <TableCell>
                          { item.jobType }
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

export default ChplJobTypesView;

ChplJobTypesView.propTypes = {
  jobTypes: arrayOf(jobType),
  dispatch: func,
};

ChplJobTypesView.defaultProps = {
  jobTypes: [],
  dispatch: () => {},
};
