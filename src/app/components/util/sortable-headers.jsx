import React, { useEffect, useState } from 'react';
import {
  arrayOf,
  bool,
  func,
  node,
  oneOf,
  shape,
  string,
} from 'prop-types';
import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableCell from '@mui/material/TableCell';

import { compareStrings } from 'services/sort.service';

const styles = {
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: '1px',
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
    boxShadow: 'rgba(149, 157, 165, 0.1) 4px 4px 8px',
    backgroundColor: '#ffffff',
    zIndex: 1000,
  },
};

function ChplSortableHeaders({
  headers,
  onTableSort = () => {},
  order: initialOrder = 'asc',
  orderBy: initialOrderBy = '',
  stickyHeader = false,
}) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  useEffect(() => {
    setOrderBy(initialOrderBy);
  }, [initialOrderBy]);

  const getDirection = (cell) => {
    if (orderBy === cell.property) {
      return order;
    }
    return cell.reverseDefault ? 'desc' : 'asc';
  };

  const createSortHandler = (cell) => (event) => {
    const { property, reverseDefault } = cell;
    let direction;
    if (orderBy === property) {
      direction = order === 'asc' ? 'desc' : 'asc';
    } else {
      direction = reverseDefault ? 'desc' : 'asc';
    }
    onTableSort(event, property, direction);
  };

  return (
    <TableHead>
      <TableRow>
        { headers.map((cell, index) => (
          <TableCell
            key={cell.property || cell.text}
            align="left"
            sortDirection={orderBy === cell.property ? order : false}
            sx={(index === 0 && stickyHeader) ? styles.stickyColumn : undefined}
          >
            { cell.sortable
              ? (
                <TableSortLabel
                  active={orderBy === cell.property}
                  direction={getDirection(cell)}
                  onClick={createSortHandler(cell)}
                >
                  <Box sx={[styles.extraContainer, cell.invisible && styles.visuallyHidden]}>
                    { cell.text }
                    { cell.extra }
                  </Box>
                </TableSortLabel>
              ) : (
                <Box sx={[styles.extraContainer, cell.invisible && styles.visuallyHidden]}>
                  { cell.text }
                  { cell.extra }
                </Box>
              )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const isStringOrMissing = (value) => typeof value === 'string' || value === null || value === undefined;

// Strings (and a string against a missing value) sort ignoring case, with
// numbers in natural order; anything else (numbers, booleans, epoch dates) by `<`.
// Equal values return 0, so a stable sort keeps them in their incoming order.
const sortComparator = (property, sortDescending) => (a, b) => {
  const aValue = a[property];
  const bValue = b[property];
  let result;
  if (isStringOrMissing(aValue) && isStringOrMissing(bValue)
      && (typeof aValue === 'string' || typeof bValue === 'string')) {
    result = compareStrings(aValue, bValue);
  } else if (aValue === bValue) {
    result = 0;
  } else {
    result = (aValue < bValue) ? -1 : 1;
  }
  return result * (sortDescending ? -1 : 1);
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

export { ChplSortableHeaders, sortComparator };
