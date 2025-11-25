import React, { useEffect, useState } from 'react';
import {
  Button,
  Chip,
  FormControlLabel,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { useFilterContext } from './filter-context';

import { ChplTooltip } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getStatusIcon } from 'services/listing.service';
import theme from 'themes/theme';
import { palette } from 'themes';

const useStyles = makeStyles(() => ({
  filterContainer: {
    display: 'flex',
    padding: '16px 32px',
    backgroundColor: '#fafdff',
    borderBottom: '1px solid #bbb',
    flexWrap: 'wrap',
    flexFlow: 'column',
    alignItems: 'flex-start',
    [theme.breakpoints.up('sm')]: {
      flexWrap: 'wrap',
    },
  },
  filterSelectedContainer: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  filterChipsContainer: {
    display: 'flex',
    gap: '8px',
    alignContent: 'flex-start',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    border: `1px solid ${palette.primary}`,
    backgroundColor: palette.white,
  },
  chipAvatar: {
    backgroundColor: 'transparent!important',
  },
}));

const truncate = (str, n, useWordBoundary) => {
  if (str.length <= n) { return str; }
  const subString = str.slice(0, n - 1);
  return `${useWordBoundary ? subString.slice(0, subString.lastIndexOf(' ')) : subString}...`;
};

const maxLengthForChip = 40;

function ChplFilterChips() {
  const [filters, setFilters] = useState([]);
  const filterContext = useFilterContext();
  const classes = useStyles();
  const DISPLAY_MAX = 7;

  useEffect(() => {
    setFilters(filterContext.filters
      .sort((a, b) => (a.getFilterDisplay(a) < b.getFilterDisplay(b) ? -1 : 1))
      .map((filter) => ({
        ...filter,
        values: filter.values
          .filter((v) => v.selected)
          .sort((a, b) => filter.sortValues(filter, a, b)),
      }))
      .filter((filter) => filter.values.length > 0));
  }, [filterContext.filters]);

  const removeChip = (f, v) => {
    if (filterContext.analytics) {
      eventTrack({
        ...filterContext.analytics,
        event: 'Remove Filter Chip',
        label: f.getValueDisplay(v),
        aggregationName: f.getFilterDisplay(f),
      });
    }
    filterContext.dispatch('toggle', f, v);
  };

  const toggleOperator = (f) => {
    if (filterContext.analytics) {
      eventTrack({
        ...filterContext.analytics,
        event: `Set Any/All Filter to ${f.operator === 'and' ? 'Any' : 'All'}`,
        label: f.getFilterDisplay(f),
      });
    }
    filterContext.dispatch('toggleOperator', f);
  };

  const toggleDevelopersListingsCriteriaOption = (f) => {
    if (filterContext.analytics) {
      eventTrack({
        ...filterContext.analytics,
        event: `Set Active/All Listing Filter to ${f.developersListingsCriteriaOption === 'active' ? 'Active Listings' : 'All Listings'}`,
        label: f.getFilterDisplay(f),
      });
    }
    filterContext.dispatch('toggleDevelopersListingsCriteriaOption', f);
  };

  const toggleShowAll = (f) => {
    if (filterContext.analytics) {
      eventTrack({
        ...filterContext.analytics,
        event: `Toggle Show All to ${f.showAll ? 'Some' : 'All'}`,
        label: f.getFilterDisplay(f),
      });
    }
    filterContext.dispatch('toggleShowAll', f);
  };

  return (
    <span className={classes.filterContainer} id="filter-chips">
      <Typography variant="subtitle2">Filters Applied:</Typography>
      <div className={classes.filterChipsContainer}>
        { filters.map((f) => (
          <span
            className={classes.filterSelectedContainer}
            key={f.key}
          >
            <Typography variant="body1">
              <strong>
                {f.getFilterDisplay(f)}
              </strong>
            </Typography>
            { f.operatorKey
              && (
                <FormControlLabel
                  control={(
                    <Switch
                      id={`${f.key}-operator-chips-toggle`}
                      color="primary"
                      checked={f.operator === 'and'}
                      onChange={() => toggleOperator(f)}
                    />
                  )}
                  label={f.operator === 'and' ? 'All' : 'Any'}
                />
              )}
            { f.developersListingsCriteriaOptionKey
              && (
                <FormControlLabel
                  control={(
                    <Switch
                      id={`${f.key}-developers-listings-criteria-option-chips-toggle`}
                      color="primary"
                      checked={f.developersListingsCriteriaOption === 'all'}
                      onChange={() => toggleDevelopersListingsCriteriaOption(f)}
                    />
                  )}
                  label={f.developersListingsCriteriaOption === 'active' ? 'Active Listings' : 'All Listings'}
                />
              )}
            {f.values
              .filter((v, idx) => f.showAll || idx < DISPLAY_MAX)
              .map((v) => (
                <React.Fragment key={v.value}>
                  { f.getValueDisplay(v).length > maxLengthForChip
                    ? (
                      <ChplTooltip
                        title={f.getLongValueDisplay(v)}
                      >
                        <Chip
                          avatar={f.key === 'certificationStatuses' ? getStatusIcon({ name: f.getValueDisplay(v) }) : undefined}
                          label={truncate(f.getValueDisplay(v), maxLengthForChip, true)}
                          onDelete={() => removeChip(f, v)}
                          variant="outlined"
                          disabled={f.required && f.values.length === 1}
                          classes={{ avatar: classes.chipAvatar, root: classes.chip }}
                        />
                      </ChplTooltip>
                    ) : (
                      <Chip
                        avatar={f.key === 'certificationStatuses' ? getStatusIcon({ name: f.getValueDisplay(v) }) : undefined}
                        label={f.getValueDisplay(v)}
                        onDelete={() => removeChip(f, v)}
                        variant="outlined"
                        disabled={f.required && f.values.length === 1}
                        classes={{ avatar: classes.chipAvatar, root: classes.chip }}
                      />
                    )}
                </React.Fragment>
              ))}
            { f.values.length > DISPLAY_MAX
              && (
                <Button
                  onClick={() => toggleShowAll(f)}
                  color="primary"
                  variant="text"
                >
                  { f.showAll ? 'Show Fewer' : `Show ${f.values.length - DISPLAY_MAX} More` }
                </Button>
              )}
          </span>
        ))}
      </div>
    </span>
  );
}

export default ChplFilterChips;

ChplFilterChips.propTypes = {};
