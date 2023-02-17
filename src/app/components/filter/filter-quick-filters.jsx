import React, { useEffect, useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { useFilterContext } from './filter-context';

import { ChplTooltip } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { palette } from 'themes';

function ChplFilterQuickFilters() {
  const $analytics = getAngularService('$analytics');
  const { analytics, dispatch, filters } = useFilterContext();
  const [anchor, setAnchor] = useState(null);
  const [open, setOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState(undefined);

  useEffect(() => {
    setQuickFilter(filters.find((f) => f.key === 'quickFilters'));
  }, [filters]);

  const handleClick = (e) => {
    if (analytics) {
      $analytics.eventTrack('Open Quick Filter', { category: analytics.category });
    }
    setAnchor(e.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchor(null);
    setOpen(false);
  };

  const loadQuickFilter = (value) => {
    dispatch('update', quickFilter, {
      ...value,
      selected: true,
    });
  };

  if (!quickFilter) {
    return null;
  }

  return (
    <>
      <ChplTooltip title="Quick Filters">
        <IconButton aria-controls="quick-filter-menu" aria-haspopup="true" onClick={handleClick}>
          <MoreVertIcon htmlColor="#000" />
        </IconButton>
      </ChplTooltip>
      <Menu
        id="quick-filter-menu"
        open={open}
        anchorEl={anchor}
        keepMounted
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            alignItems: 'center',
            borderRadius: '0 0 8px 8px',
            marginTop: '53px',
            marginLeft: '16px',
            border: `1px solid ${palette.grey}`,
            boxShadow: 'rgb(149 157 165 / 40%) 0px 6px 16px 6px',
            backgroundColor: '#fff',
          },
        }}
      >
        <MenuItem
          onClick={() => dispatch('resetAll')}
        >
          Reset All Filters
        </MenuItem>
        { quickFilter.values.map((v) => (
          <MenuItem
            key={v.value}
            onClick={() => loadQuickFilter(v)}
            disabled={v.display.includes('(0)')}
          >
            { v.display }
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default ChplFilterQuickFilters;

ChplFilterQuickFilters.propTypes = {
};
