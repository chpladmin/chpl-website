import React, { useEffect, useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { arrayOf, object } from 'prop-types';

import { useFilterContext } from './filter-context';

import { ChplTooltip } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { palette } from 'themes';

function ChplFilterQuickFilters({ toggleMultipleFilters }) {
  const { analytics, dispatch, filters } = useFilterContext();
  const [anchor, setAnchor] = useState(null);
  const [open, setOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState(undefined);

  useEffect(() => {
    setQuickFilter(filters.find((f) => f.key === 'quickFilters'));
  }, [filters]);

  const handleClick = (e) => {
    if (analytics) {
      eventTrack({
        ...analytics,
        event: 'Open Quick Filter',
      });
    }
    setAnchor(e.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    if (analytics) {
      eventTrack({
        ...analytics,
        event: 'Close Quick Filter',
      });
    }
    setAnchor(null);
    setOpen(false);
  };

  const loadQuickFilter = (value) => {
    if (analytics) {
      eventTrack({
        ...analytics,
        event: 'Open Quick Filter',
        label: value.display,
      });
    }
    dispatch('update', quickFilter, {
      ...value,
      selected: true,
    });
    dispatch('hasSearched');
  };

  if (!quickFilter) {
    return null;
  }

  return (
    <>
      <ChplTooltip title="Quick Filters">
        <IconButton aria-controls="quick-filter-menu" aria-haspopup="true" onClick={handleClick}>
          <MoreVertIcon color="inherit" style={{ color: palette.black }} />
        </IconButton>
      </ChplTooltip>
      <Menu
        id="quick-filter-menu"
        open={open}
        anchorEl={anchor}
        getContentAnchorEl={null}
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
            border: `1px solid ${palette.grey}`,
            boxShadow: 'rgb(149 157 165 / 40%) 0px 6px 16px 6px',
            backgroundColor: '#fff',
            marginTop: '19px',
            marginRight: '16px',
          },
        }}
      >
        <MenuItem
          onClick={() => dispatch('resetAll')}
        >
          Reset All Filters
        </MenuItem>
        { toggleMultipleFilters?.length > 0
          && toggleMultipleFilters.map((f) => (
            <MenuItem
              key={f.display}
              onClick={() => f.toggle()}
            >
              { f.display }
            </MenuItem>
          ))}
        { quickFilter.values
          .filter((v) => toggleMultipleFilters?.display !== v.value)
          .map((v) => (
            <MenuItem
              key={v.value}
              onClick={() => loadQuickFilter(v)}
              disabled={quickFilter.getValueDisplay(v).includes('(0)')}
            >
              { quickFilter.getValueDisplay(v) }
            </MenuItem>
          ))}
      </Menu>
    </>
  );
}

export default ChplFilterQuickFilters;

ChplFilterQuickFilters.propTypes = {
  toggleMultipleFilters: arrayOf(object),
};

ChplFilterQuickFilters.defaultProps = {
  toggleMultipleFilters: undefined,
};
