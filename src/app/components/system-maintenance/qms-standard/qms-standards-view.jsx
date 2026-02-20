import React, { useContext, useEffect, useState } from 'react';
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
import { UserContext } from 'shared/contexts';
import { qmsStandardType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const headers = [
  { property: 'name', text: 'Name', sortable: true },
  { text: 'Action', invisible: true },
];

const useStyles = makeStyles({
  ...utilStyles,
  tableResultsHeaderContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

function ChplQmsStandardsView(props) {
  const { dispatch } = props;
  const [qmsStandards, setQmsStandards] = useState([]);
  const { hasAnyRole } = useContext(UserContext);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('regulatoryTextCitation');
  const classes = useStyles();

  useEffect(() => {
    setQmsStandards(props.qmsStandards
      .map((item) => ({
        ...item,
      }))
      .sort(sortComparator('name')));
  }, [props.qmsStandards]); // eslint-disable-line react/destructuring-assignment

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = qmsStandards.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setQmsStandards(updated);
  };

  return (
    <>
      { hasAnyRole(['chpl-admin', 'chpl-onc']) && (
        <div className={classes.tableResultsHeaderContainer}>
          <Button
            onClick={() => dispatch({ action: 'edit', payload: {} })}
            id="add-new-qms-standard"
            variant="contained"
            color="primary"
            endIcon={<AddIcon />}
          >
            Add
          </Button>
        </div>
      )}
      <TableContainer className={classes.container} component={Paper}>
        <Table
          aria-label="QMS Standard table"
        >
          <ChplSortableHeaders
            headers={headers.filter((h) => hasAnyRole(['chpl-admin', 'chpl-onc']) || !h.invisible)}
            onTableSort={handleTableSort}
            orderBy={orderBy}
            order={order}
            stickyHeader
          />
          <TableBody>
            { qmsStandards
              .map((item) => (
                <TableRow key={`${item.id}`}>
                  <TableCell className={classes.firstColumn}>
                    { item.name }
                  </TableCell>
                  { hasAnyRole(['chpl-admin', 'chpl-onc']) && (
                    <TableCell align="right">
                      <Button
                        onClick={() => dispatch({ action: 'edit', payload: item })}
                        id={`edit-qms-standard-${item.id}`}
                        variant="contained"
                        color="secondary"
                        endIcon={<EditOutlinedIcon />}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ChplQmsStandardsView;

ChplQmsStandardsView.propTypes = {
  dispatch: func.isRequired,
  qmsStandards: arrayOf(qmsStandardType).isRequired,
};
