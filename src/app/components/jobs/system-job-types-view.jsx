import React, { useEffect, useState } from 'react';
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
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { arrayOf, func } from 'prop-types';

import { ChplSortableHeaders, sortComparator } from 'components/util/sortable-headers';
import { job as jobType } from 'shared/prop-types';

const headers = [
  { property: 'name', text: 'Job Name', sortable: true },
  { property: 'description', text: 'Description' },
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

function ChplSystemJobTypesView(props) {
  const { dispatch } = props;
  const [jobTypes, setJobTypes] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const classes = useStyles();

  useEffect(() => {
    setJobTypes(props.jobTypes
      .sort(sortComparator('name')));
  }, []);

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = jobTypes.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setJobTypes(updated);
  };

  return (
    <Card>
      <CardHeader title="Types of Jobs" />
      <CardContent>
        <TableContainer className={classes.container} component={Paper}>
          <Table
            aria-label="Types of Jobs table"
          >
            <ChplSortableHeaders
              headers={headers}
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
                    <TableCell align="right">
                      <IconButton
                        onClick={() => dispatch({ action: 'schedule', payload: item })}
                        color="primary"
                        aria-label={`Schedule Job ${item.name}`}
                      >
                        <PlayArrowIcon />
                      </IconButton>
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

export default ChplSystemJobTypesView;

ChplSystemJobTypesView.propTypes = {
  jobTypes: arrayOf(jobType).isRequired,
  dispatch: func.isRequired,
};
