import React, { useEffect, useState } from 'react';
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
import { jobType } from 'shared/prop-types';

const headers = [
  { property: 'name', text: 'Job Name' },
  { property: 'description', text: 'Description' },
  { property: 'oncAcbSpecific', text: 'ONC-ACB Specific' },
  { property: 'jobType', text: 'Job Type' },
  { property: 'actions', text: 'Actions', invisible: true },
];

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
          onClick={() => dispatch('schedule', item)}
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
          onClick={() => dispatch('schedule', item)}
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
  const [jobTypes, setJobTypes] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setJobTypes(props.jobTypes
      .sort((a, b) => (a.name < b.name ? -1 : 1))
      .map((job) => ({
        ...job,
        oncAcbSpecific: job.jobDataMap.acbSpecific ? 'Yes' : 'No',
        jobType: groupMapping[job.group],
        action: getAction(job, dispatch),
      })));
  }, [props.jobTypes, dispatch]); // eslint-disable-line react/destructuring-assignment

  return (
    <Card className={classes.cardSpacing}>
      <CardHeader title="Types of Jobs" />
      <CardContent>
        <TableContainer className={classes.container} component={Paper}>
          <Table
            aria-label="Types of Jobs table"
          >
            <ChplSortableHeaders
              headers={headers}
              onTableSort={() => {}}
              orderBy="email"
              order="asc"
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
                    <TableCell>
                      { item.jobType }
                    </TableCell>
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
