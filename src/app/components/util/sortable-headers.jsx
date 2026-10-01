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

const styles = {
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
                  direction={orderBy === cell.property ? order : (cell.reverseDefault ? 'desc' : 'asc')}
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

export { ChplSortableHeaders, sortComparator };
