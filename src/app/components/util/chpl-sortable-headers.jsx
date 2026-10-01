import React, { useEffect, useState } from 'react';
import {
  arrayOf,
  bool,
  func,
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
  stickyColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0 4px 8px',
    backgroundColor: '#ffffff',
    zIndex: 2,
  },
  stickyHeader: {
    position: 'sticky',
    top: 0,
    backgroundColor: '#ffffff',
    zIndex: 3,
  },
};

function ChplSortableHeaders({
  onTableSort,
  order: initialOrder = '',
  orderBy: initialOrderBy = '',
  headers,
  stickyHeader = false,
}) {
  const [order, setOrder] = useState('');
  const [orderBy, setOrderBy] = useState('');

  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  useEffect(() => {
    setOrderBy(initialOrderBy);
  }, [initialOrderBy]);

  const createSortHandler = (property) => (event) => {
    const isAsc = orderBy === property && order === 'asc';
    const orderDirection = order === 'asc' ? '' : '-';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    onTableSort(event, property, orderDirection);
  };

  const getCellStyles = (index) => {
    const cellStyles = [];
    if (stickyHeader) {
      cellStyles.push(styles.stickyHeader);
    }
    if (index === 0 && stickyHeader) {
      cellStyles.push(styles.stickyColumn);
    }
    return cellStyles;
  };

  return (
    <TableHead>
      <TableRow>
        { headers.map((headCell, index) => (
          headCell.sortable
            ? (
              <TableCell
                key={headCell.property}
                align="left"
                sortDirection={orderBy === headCell.property ? order : false}
                sx={getCellStyles(index)}
              >
                <TableSortLabel
                  active={orderBy === headCell.property}
                  direction={orderBy === headCell.property ? order : 'asc'}
                  onClick={createSortHandler(headCell.property)}
                >
                  { headCell.text }
                  {orderBy === headCell.property
                    ? (
                      <Box component="span" sx={styles.visuallyHidden}>
                        { order === 'desc' ? 'sorted descending' : 'sorted ascending' }
                      </Box>
                    ) : null}
                </TableSortLabel>
              </TableCell>
            )
            : (
              <TableCell
                align="left"
                key={headCell.text}
                sx={getCellStyles(index)}
              >
                <Box component="span" sx={headCell.invisible ? styles.visuallyHidden : undefined}>
                  { headCell.text }
                </Box>
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
