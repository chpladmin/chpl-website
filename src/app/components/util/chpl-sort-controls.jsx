import React, { useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
} from '@material-ui/core';
import {
  arrayOf,
  func,
  oneOf,
  shape,
  string,
} from 'prop-types';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import SortIcon from '@material-ui/icons/Sort';

function ChplSortControls({
  sortOptions,
  orderBy,
  order,
  onSort,
}) {
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);

  const handleSortChange = (property) => {
    const newOrder = orderBy === property && order === 'asc' ? 'desc' : 'asc';
    onSort(property, newOrder);
    setSortMenuAnchor(null);
  };

  const toggleSortDirection = () => {
    const newOrder = order === 'asc' ? 'desc' : 'asc';
    onSort(orderBy, newOrder);
  };

  const getCurrentSortLabel = () => {
    const currentOption = sortOptions.find((opt) => opt.property === orderBy);
    return currentOption?.text || orderBy;
  };

  return (
    <Box display="flex" alignItems="center" mr={2}>
      <ButtonGroup color="primary" size="small" variant="outlined" style={{ border: '1px solid primary' }}>
        <Button
          onClick={(e) => setSortMenuAnchor(e.currentTarget)}
          startIcon={<SortIcon />}
          color="primary"
          style={{ padding: '8px 16px', fontSize:'12px' }}
        >
          {getCurrentSortLabel()}
        </Button>
        <Button
          onClick={toggleSortDirection}
          aria-label={`Sort ${order === 'asc' ? 'descending' : 'ascending'}`}
          title={`Sort ${order === 'asc' ? 'descending' : 'ascending'}`}
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
    </Box>
  );
}

export default ChplSortControls;

ChplSortControls.propTypes = {
  sortOptions: arrayOf(shape({
    property: string.isRequired,
    text: string.isRequired,
  })).isRequired,
  orderBy: string.isRequired,
  order: oneOf(['asc', 'desc']).isRequired,
  onSort: func.isRequired,
};
