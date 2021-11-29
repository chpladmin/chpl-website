import React, { useState } from 'react';
import {
  arrayOf, bool, func, oneOf, shape, string,
} from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableCell from '@material-ui/core/TableCell';

const useStyles = makeStyles(() => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  stickyColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0 4px 8px',
    backgroundColor: '#ffffff',
    zIndex: '99',
  },
}));

function ChplSortableHeaders(props) {
  const [order, setOrder] = useState(props.order);
  const [orderBy, setOrderBy] = useState(props.orderBy);
  const classes = useStyles();

  const createSortHandler = (property) => (event) => {
    const isAsc = orderBy === property && order === 'asc';
    const orderDirection = order === 'asc' ? '' : '-';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    props.onTableSort(event, property, orderDirection);
  };

  return (
    <TableHead>
      <TableRow>
        { props.headers.map((headCell, index) => (
          headCell.sortable
            ? (
              <TableCell
                key={headCell.property}
                align="left"
                sortDirection={orderBy === headCell.property ? order : false}
                className={(index === 0 && props.stickyHeader) ? classes.stickyColumn : undefined}
              >
                <TableSortLabel
                  className={classes.header}
                  active={orderBy === headCell.property}
                  direction={orderBy === headCell.property ? order : 'asc'}
                  onClick={createSortHandler(headCell.property)}
                >
                  { headCell.text }
                  {orderBy === headCell.property
                    ? (
                      <span className={classes.visuallyHidden}>
                        { order === 'desc' ? 'sorted descending' : 'sorted ascending' }
                      </span>
                    ) : null}
                </TableSortLabel>
              </TableCell>
            )
            : (
              <TableCell align="left" key={headCell.text}>
                <span className={headCell.invisible && classes.visuallyHidden}>
                  { headCell.text }
                </span>
              </TableCell>
            )
        ))}
      </TableRow>
    </TableHead>
  );
}

export default ChplSortableHeaders;

ChplSortableHeaders.propTypes = {
  onTableSort: func.isRequired,
  order: oneOf(['asc', 'desc', '']),
  orderBy: string,
  headers: arrayOf(shape({
    invisible: bool,
    property: string,
    text: string,
    sortable: bool,
  })).isRequired,
  stickyHeader: bool,
};

ChplSortableHeaders.defaultProps = {
  order: '',
  orderBy: '',
  stickyHeader: false,
};
