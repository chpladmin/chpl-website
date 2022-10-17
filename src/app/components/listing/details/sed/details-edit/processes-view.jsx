import React, { useEffect, useState } from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

import { ChplSortableHeaders, sortComparator } from 'components/util/sortable-headers';
import { isCures, sortCriteria } from 'services/criteria.service';
import { ucdProcess as ucdProcessPropType } from 'shared/prop-types';

const headers = [
  { property: 'name', text: 'UCD Process', sortable: true },
  { property: 'details', text: 'UCD Process Details' },
  { text: 'Certification Criteria' },
  { text: 'Action', invisible: true },
];

const useStyles = makeStyles({
  firstColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#fff',
  },
  tableResultsHeaderContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

function ChplUcdProcessesView(props) {
  const { dispatch } = props;
  const [ucdProcesses, setUcdProcesses] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const classes = useStyles();

  useEffect(() => {
    setUcdProcesses(props.ucdProcesses
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
          .sort(sortCriteria)
          .map((c) => c.number + (isCures(c) ? ' (Cures Update)' : ''))
          .join(', '),
      }))
      .sort(sortComparator('name')));
  }, [props.ucdProcesses]); // eslint-disable-line react/destructuring-assignment

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = ucdProcesses.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setUcdProcesses(updated);
  };

  return (
    <>
      <div className={classes.tableResultsHeaderContainer}>
        <Button
          onClick={() => dispatch({ action: 'edit', payload: {} })}
          id="add-new-ucd-process"
          variant="contained"
          color="primary"
          endIcon={<AddIcon />}
        >
          Add
        </Button>
      </div>
      <TableContainer className={classes.container} component={Paper}>
        <Table
          aria-label="UCD Processes table"
        >
          <ChplSortableHeaders
            headers={headers}
            onTableSort={handleTableSort}
            orderBy={orderBy}
            order={order}
            stickyHeader
          />
          <TableBody>
            { ucdProcesses
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell className={classes.firstColumn}>
                    { item.name }
                  </TableCell>
                  <TableCell>
                    { item.details }
                  </TableCell>
                  <TableCell>
                    { item.criteriaDisplay }
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      onClick={() => dispatch({ action: 'edit', payload: item })}
                      id={`edit-ucd-process-${item.id}`}
                      variant="contained"
                      color="secondary"
                      endIcon={<EditOutlinedIcon />}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ChplUcdProcessesView;

ChplUcdProcessesView.propTypes = {
  dispatch: func.isRequired,
  ucdProcesses: arrayOf(ucdProcessPropType).isRequired,
};
