import React, { useEffect, useState } from 'react';
import {
  arrayOf, bool, func, node, oneOf, shape, string,
} from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableCell from '@material-ui/core/TableCell';

const useStyles = makeStyles({
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
  extraContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  stickyColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0 4px 8px',
    backgroundColor: '#ffffff',
  },
});

function ChplSortableHeaders(props) {
  const { headers } = props;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const classes = useStyles();

  useEffect(() => {
    setOrder(props.order);
  }, [props.order]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setOrderBy(props.orderBy);
  }, [props.orderBy]); // eslint-disable-line react/destructuring-assignment

  const createSortHandler = (cell) => (event) => {
    const { property, reverseDefault } = cell;
    let direction;
    if (orderBy === property) {
      direction = order === 'asc' ? 'desc' : 'asc';
    } else {
      direction = reverseDefault ? 'desc' : 'asc';
    }
    props.onTableSort(event, property, direction);
  };

  return (
    <TableHead>
      <TableRow>
        { headers.map((cell, index) => (
          <TableCell
            key={cell.property || cell.text}
            align="left"
            sortDirection={orderBy === cell.property ? order : false}
            className={(index === 0 && props.stickyHeader) ? classes.stickyColumn : undefined}
          >
            { cell.sortable
              ? (
                <TableSortLabel
                  className={classes.header}
                  active={orderBy === cell.property}
                  direction={orderBy === cell.property ? order : (cell.reverseDefault ? 'desc' : 'asc')}
                  onClick={createSortHandler(cell)}
                >
                  <div className={`${classes.extraContainer} ${cell.invisible && classes.visuallyHidden}`}>
                    { cell.text }
                    { cell.extra }
                  </div>
                </TableSortLabel>
              ) : (
                <div className={`${classes.extraContainer} ${cell.invisible && classes.visuallyHidden}`}>
                  { cell.text }
                  { cell.extra }
                </div>
              )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const sortComparator = (property, sortDescending) => (a, b) => {
  let result = (a[property] < b[property]) ? -1 : 1;
  result *= (sortDescending ? -1 : 1);
  return result;
};

ChplSortableHeaders.propTypes = {
  headers: arrayOf(shape({
    property: string, // key to sort by
    text: string, // text to display
    invisible: bool, // hide text (leave visible for SR)
    sortable: bool, // is this column sortable?
    reverseDefault: bool, // if sortable, should it default to descending?
    extra: node, // extra nodes to add as children
  })).isRequired,
  onTableSort: func,
  order: oneOf(['asc', 'desc']),
  orderBy: string,
  stickyHeader: bool,
};

ChplSortableHeaders.defaultProps = {
  onTableSort: () => {},
  order: 'asc',
  orderBy: '',
  stickyHeader: false,
};

export { ChplSortableHeaders, sortComparator };
