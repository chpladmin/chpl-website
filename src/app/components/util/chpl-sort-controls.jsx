import React, { useState, useRef, useCallback } from 'react';
import {
  Box, Button, ButtonGroup, Card, Menu, MenuItem,
} from '@mui/material';
import {
  arrayOf,
  bool,
  func,
  oneOf,
  shape,
  string,
} from 'prop-types';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SortIcon from '@mui/icons-material/Sort';

import { theme, palette } from 'themes';

const styles = {
  container: {
    marginRight: '16px',
    display: 'flex',
    border: `1px solid ${palette.primaryBorder}`,
    borderRadius: '4px',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginRight: 0,
    },
  },
  buttonGroup: {
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  primaryButton: {
    [theme.breakpoints.down('md')]: {
      flex: '1 1 auto',
      justifyContent: 'flex-start',
    },
  },
  directionButton: {
    borderLeft: `1px solid ${palette.primaryBorder}`,
    borderRadius: 0,
  },
};

function ChplSortControls({
  sortOptions,
  orderBy,
  order,
  onSort,
}) {
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
  const currentOrderRef = useRef(order);

  // Keep ref in sync with prop
  currentOrderRef.current = order;

  const handleSortChange = (property) => {
    const option = sortOptions.find((opt) => opt.property === property);
    const defaultOrder = option?.reverseDefault ? 'desc' : 'asc';
    let newOrder;
    if (orderBy === property) {
      newOrder = currentOrderRef.current === 'asc' ? 'desc' : 'asc';
    } else {
      newOrder = defaultOrder;
    }

    currentOrderRef.current = newOrder;
    onSort(property, newOrder);
    setSortMenuAnchor(null);
  };

  const toggleSortDirection = useCallback(() => {
    // Always toggle based on the ref, which has the most recent value
    const newOrder = currentOrderRef.current === 'asc' ? 'desc' : 'asc';
    currentOrderRef.current = newOrder;
    onSort(orderBy, newOrder);
  }, [orderBy, onSort]);

  const getCurrentSortLabel = () => {
    const currentOption = sortOptions.find((opt) => opt.property === orderBy);
    return currentOption?.text || orderBy;
  };

  return (
    <Card elevation={0} sx={styles.container}>
      <ButtonGroup sx={styles.buttonGroup} color="primary" size="small" variant="text">
        <Button
          sx={styles.primaryButton}
          onClick={(e) => setSortMenuAnchor(e.currentTarget)}
          startIcon={<SortIcon />}
          color="primary"
          style={{ padding: '0 16px', fontSize: '12px' }}
        >
          {getCurrentSortLabel()}
        </Button>
        <Button
          onClick={toggleSortDirection}
          aria-label={`Sort ${order === 'asc' ? 'descending' : 'ascending'}`}
          title={`Sort ${order === 'asc' ? 'descending' : 'ascending'}`}
          sx={styles.directionButton}
          style={{ minWidth: '40px', padding: '9px 4px' }}
          color="primary"
        >
          {order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
        </Button>
      </ButtonGroup>
      <Menu
        anchorEl={sortMenuAnchor}
        open={Boolean(sortMenuAnchor)}
        onClose={() => setSortMenuAnchor(null)}
      >
        {sortOptions.map((option) => (
          <MenuItem
            key={option.property}
            onClick={() => handleSortChange(option.property)}
          >
            {option.text}
          </MenuItem>
        ))}
      </Menu>
    </Card>
  );
}

export default ChplSortControls;

ChplSortControls.propTypes = {
  sortOptions: arrayOf(shape({
    property: string.isRequired,
    text: string.isRequired,
    reverseDefault: bool,
  })).isRequired,
  orderBy: string.isRequired,
  order: oneOf(['asc', 'desc']).isRequired,
  onSort: func.isRequired,
};
